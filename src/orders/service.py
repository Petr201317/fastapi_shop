from decimal import Decimal
from fastapi import HTTPException
from .repo import OrdersRepository
from .schemas import OrderCreate, OrderCreateDb, OrderItemCreateDb, OrderUpdateStatus


class OrdersService:
    def __init__(self, repo: OrdersRepository):
        self.repo = repo

    async def create_order(self, order_credentials: OrderCreate, payload):
        user_id = int(payload.sub)
        unique_product_ids = list({item.product_id for item in order_credentials.items})
        prices_map = await self.repo.get_products_prices(unique_product_ids)

        missing_products = [str(product_id) for product_id in unique_product_ids if product_id not in prices_map]
        if missing_products:
            raise HTTPException(
                status_code=400,
                detail=f"Products not found: {', '.join(missing_products)}",
            )

        order_items_db: list[OrderItemCreateDb] = []
        total_price = Decimal("0.00")
        for item in order_credentials.items:
            price_at_purchase = prices_map[item.product_id]
            order_items_db.append(
                OrderItemCreateDb(
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price_at_purchase=price_at_purchase,
                )
            )
            total_price += price_at_purchase * item.quantity

        order_db_data = OrderCreateDb(
            user_id=user_id,
            total_price=total_price.quantize(Decimal("0.01")),
            items=order_items_db,
        )
        debited = await self.repo.try_debit_user_balance(
            user_id=user_id,
            amount=order_db_data.total_price,
        )
        if not debited:
            raise HTTPException(status_code=400, detail="Insufficient balance")

        try:
            await self.repo.add_order(order_db_data)
            await self.repo.commit()
        except Exception:
            await self.repo.rollback()
            raise
        return True

    async def get_orders_for_user(self, payload):
        user_id = int(payload.sub)
        res = await self.repo.get_orders_by_user_id(user_id)
        return res
import uuid

from .schemas import CartItemAdd, CartItemAddDb, CartItemRead


class CartService:
    def __init__(self, repo):
        self.repo = repo

    async def add_product_in_cart(self, credentials: CartItemAdd, user_payload):
        user_id = int(user_payload.sub)
        cart_item_data = CartItemAddDb(
            user_id = user_id,
            product_id = credentials.product_id,
            quantity = credentials.quantity
        )
        return await self.repo.add_product_in_cart(cart_item_data)

    async def get_user_cart(self, user_payload):
        user_id = int(user_payload.sub)
        cart_items_data = await self.repo.get_user_cart(user_id)
        cart_items = []
        for cart_item_data in cart_items_data:
            cart_items.append(CartItemRead(
                id=cart_item_data.id,
                product_id = cart_item_data.product_id,
                quantity = cart_item_data.quantity
            ))
        return cart_items


    # service
    async def delete_product_in_cart(self, user_payload, cart_item_id: uuid.UUID):
        user_id = int(user_payload.sub)
        cart_item = await self.repo.get_user_by_cart_item_id(cart_item_id)

        if cart_item is None:
            return None

        if cart_item.user_id == user_id:
            deleted_product = await self.repo.delete_product_in_cart(cart_item_id)
            return CartItemRead(
                id=deleted_product.id,
                product_id=deleted_product.product_id,
                quantity=deleted_product.quantity
            )

        return None


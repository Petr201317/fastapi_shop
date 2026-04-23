from .schemas import CartItemAdd, CartItemAddDb


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

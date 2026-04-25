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
                product_id = cart_item_data.product_id,
                quantity = cart_item_data.quantity
            ))
        return cart_items

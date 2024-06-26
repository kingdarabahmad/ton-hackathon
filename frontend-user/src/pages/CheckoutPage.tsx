import { CheckoutDetails } from "../components/checkoutPageComp/CheckoutDetails";
import { IoArrowBackCircle } from "react-icons/io5";
import { useCart } from "../hooks/useCart";
import { Address, fromNano } from "@ton/core";
import { useTonConnect } from "../hooks/useTonConnect";
import { useFoodMiniAppContract } from "../hooks/useFoodAppContract";
import { useEffect } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, createOrder, setUserInfo, setCategory } = useCart();
  const { sender } = useTonConnect();
  const { foodMiniAppContract } = useFoodMiniAppContract();
  const wallet = useTonWallet();

  useEffect(() => {
    if (!wallet) return;
    let userData = cart.userDetails;
    if (userData.name == "") {
      setUserInfo({
        ...userData,
        walletAddress: Address.parse(wallet.account.address),
      });
    }
    console.log(userData);
    console.log(userData?.walletAddress.toString());
  }, [wallet]);

  return (
    <div className="h-screen w-full py-4 flex flex-col justify-between gap-4 px-2">
      <div className="flex flex-col overflow-visible">
        <div className="flex items-center gap-2">
          <IoArrowBackCircle
            size={26}
            onClick={() => window.history.back()}
            className="cursor-pointer"
          />
          <h1 className="text-primary text-xl font-bold">Checkout</h1>
        </div>
        <div className="p-2 rounded-md border-4">
          <div className="flex gap-2">
            <img
              className="w-28 aspect-square rounded-md object-cover"
              src={cart.restaurant.imageUrl}
              alt="Restaurant Image"
            />
            <div>
              {/* <h1 className="text-primary font-bold">Order #1234545</h1> */}
              <h1 className="text-secondary font-bold text-2xl">
                {cart.restaurant.name}
              </h1>
              <h1 className="text-primary text-lg line-clamp-3">
                {cart.restaurant.description}
              </h1>
            </div>
          </div>
        </div>
        <div className="p-2 rounded-md border border-secondary text-primary text-sm">
          {cart.items.map((item, index) => (
            <div
              key={index}
              className="flex font-semibold justify-between px-1"
            >
              <h1>
                {item.name} <span>x {Number(item.quantity)}</span>
              </h1>
              <h1>
                {(Number(fromNano(item.price)) * Number(item.quantity)).toFixed(
                  2
                )}{" "}
                ton
              </h1>
            </div>
          ))}
          <div className="flex font-bold justify-between border-t border-primary px-1 mt-2 pt-2">
            <h1>Total</h1>
            <h1>
              {Number(
                fromNano(
                  cart.items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0n
                  )
                )
              ).toFixed(2)}{" "}
              ton
            </h1>
          </div>
        </div>
        <div className="p-2 rounded-md border-4">
          <CheckoutDetails
            data={cart.userDetails}
            setData={setUserInfo}
            category={cart.category}
            setCategory={setCategory}
          />
        </div>
      </div>
      <button
        className="w-full text-center bg-secondary p-2 text-white font-bold rounded-lg"
        onClick={
          cart.userDetails.name == "" ||
          cart.userDetails.location == "" ||
          cart.userDetails.phoneNumber == ""
            ? () => {}
            : () => createOrder(foodMiniAppContract!, sender, navigate)
        }
      >
        Confirm Order
      </button>
    </div>
  );
};

export default CheckoutPage;

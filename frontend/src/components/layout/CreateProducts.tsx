import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import useCreateProduct from "../../contracts/hooks/useCreateProduct";
import useReadBalance from "../../contracts/hooks/useReadBalance";

export default function CreateProduct({
  setOpenForm,
}: {
  setOpenForm: Dispatch<SetStateAction<boolean>>;
}) {
  const [userEmail, setUserEmail] = useState<string>("");
  const [_, setCID] = useState<string>("");
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const { approveAndCreate, createProductFee, isPending } = useCreateProduct();
  const { formatedBalance } = useReadBalance();
  const [sufficientBalance, setSufficientBalance] = useState<boolean>(true);

  useEffect(() => {
    if (createProductFee > formatedBalance + 1) {
      setSufficientBalance(false);
      setDisableSubmit(true);
    } else {
      setSufficientBalance(true);
      setDisableSubmit(false);
    }
  }, [createProductFee, formatedBalance]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setDisableSubmit(true);
      toast.loading("Listing Product...", { id: "create-product" });

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const response = await axios.post("create-product", formData);

      const email = formData.get("email") as string | null;
      const price = formData.get("price") as number | null;

      if (email) {
        localStorage.setItem("user-email", email);
      }
      const { _id: id, imageCid } = response.data.product;
      setCID(imageCid);

      toast.success("Product listed successfully!", {
        id: "create-product",
      });

      try {
        await approveAndCreate(BigInt(price ?? 0), imageCid);
      } catch (error) {
        axios
          .delete("/delete-product", {
            data: {
              id,
            },
          })
          .then(() => {
            toast("Product deleted");
          })
          .catch(() => {
            toast("Failed to delete product");
          });
      }
    } catch (error: any) {
      toast.error(`Error: ${error.response.data.message}`, {
        id: "create-product",
      });
    } finally {
      setDisableSubmit(false);
      setOpenForm(false);
    }
  }

  useEffect(() => {
    setUserEmail(localStorage.getItem("user-email") ?? "");
  }, [setUserEmail]);

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black/45">
      <X
        className="float-right m-5"
        color="red"
        onClick={() => setOpenForm(false)}
      />
      <form
        onSubmit={submit}
        encType="multipart/form-data"
        className="absolute-center bg-neutral-950 flex flex-col gap-10 p-10 rounded-2xl *:border-2 *:border-neutral-800 *:p-3 *:rounded-lg"
      >
        <input type="text" name="name" placeholder="Product name" required />
        <input
          type="number"
          name="price"
          placeholder="Product price (MNEE token)"
          required
        />
        <input type="file" name="image" accept=".jpg,.jpeg,.png" required />
        <input
          type="email"
          name="email"
          placeholder="Enter your email for notification"
          defaultValue={userEmail}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="short description"
          required
        />
        <button
          type="submit"
          disabled={disableSubmit}
          className={`${sufficientBalance ? "bg-gray-900" : "bg-red-500"} cursor-pointer font-bold`}
        >
          {sufficientBalance
            ? isPending || disableSubmit
              ? "Listing....."
              : "List Product"
            : "Insufficient Balance"}
        </button>
      </form>
      <div
        className={`absolute bottom-10 left-1/2 -translate-1/2 ${sufficientBalance ? "text-green-400" : "text-red-500"} font-bold`}
      >
        {sufficientBalance
          ? `You will have to pay ${createProductFee} MNEE to create a product.`
          : `Insufficient balance: ${createProductFee} MNEE required. Fund your MNEE account and retry`}
      </div>
    </div>
  );
}

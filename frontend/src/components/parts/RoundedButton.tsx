type Props = {
  type?: "button" | "submit" | "reset";
  content: any;
  onClick?: () => void;
};

export default function RoundedButton({ type = "button", content, onClick }: Props) {
  return (
    <button
      type={type}
      className="bg-neutral-200 rounded-full p-2 flex justify-center items-center text-black"
      onClick={onClick}
    >
      {content}
    </button>
  );
}

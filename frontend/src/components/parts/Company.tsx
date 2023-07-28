import { Link } from "react-router-dom";
import { FILE_URL } from "../../config/api";

type Props = {
  id: string;
  name: string;
  logoFileName?: string;
  slug:string
};

export default function Company({ id, name, logoFileName,slug }: Props) {
  return (
    <Link className="company | p-3 bg-neutral-100 rounded-lg w-[9.5rem]" to={slug}>
      <div className="logo | w-32">
        <img
          src={logoFileName ? `${FILE_URL}/companies/${id}/${logoFileName}` : "icon.png"}
          alt={name+' logo'}
          className="w-32 h-32 aspect-square rounded-md object-cover"
        />
      </div>
      <p className="pt-2 font-bold text-neutral-600 w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
        {name}
      </p>
    </Link>
  );
}

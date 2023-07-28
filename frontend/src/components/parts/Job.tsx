import { FILE_URL } from "../../config/api";
import { Link } from "react-router-dom";

type Props = {
  id: string;
  companyId: string;
  title: string;
  companyName: string;
  companyBasedAt: string;
  companyLogo?: string;
  companySlug:string;
};

export default function Job({
  id,
  title,
  companyId,
  companySlug,
  companyName,
  companyBasedAt,
  companyLogo,
}: Props) {
  return (
    <Link className="job | p-3 bg-neutral-100 rounded-lg w-full flex gap-2"
    to={`/${companySlug}/${id}`}
    >
      <div className="logo | w-20 h-20">
        <img
          src={companyLogo ? `${FILE_URL}/companies/${companyId}/${companyLogo}` : "icon.png"}
          alt=""
          className="w-20 h-20 aspect-square rounded-md object-cover"
        />
      </div>
      <div className="about flex flex-col h-full justify-around items-start">
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="company">
          <p className="text-sm text-neutral-700">{companyName}</p>
          <p className="text-sm text-neutral-600">{companyBasedAt}</p>
        </div>
      </div>
    </Link>
  );
}

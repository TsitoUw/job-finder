import { Record } from "pocketbase";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePocket } from "../../context/pocketBaseContext";
import Navbar from "../../components/parts/Navbar";
import RoundedButton from "../../components/parts/RoundedButton";
import { ArrowBack } from "@mui/icons-material";
import { FILE_URL } from "../../config/api";
import "./index.css";
import Loader from "../../components/parts/Loader";

export default function JobView() {
  const { getJobs } = usePocket();
  const location = useLocation();
  const jobId = location.pathname.split("/")[2].replaceAll("/", "");

  const [job, setJob] = useState<Record>();
  const [isFetchingJobs, setIsFetchingJobs] = useState(true);
  const [company, setCompany] = useState<Record>();

  const navigate = useNavigate();

  const descRef = useRef(null);

  const getJob = useCallback(async () => {
    setIsFetchingJobs(true);
    try {
      const res = await getJobs!(1, 1, {
        filter: `id="${jobId}"`,
        expand: "company",
      });
      if (res && res.items && res.items[0]) {
        setJob(res.items[0]);
        setCompany((res.items[0].expand as Record).company as Record);
      }
    } catch (error: any) {
      console.warn(error.response ? error.response : error);
    }

    setIsFetchingJobs(false);
  }, [jobId]);

  useEffect(() => {
    if (!jobId) navigate(-1);
    getJob();
  }, [jobId]);

  useEffect(() => {
    if (descRef && descRef.current) (descRef.current as HTMLElement).innerHTML = job?.description;
  }, [job]);

  if (isFetchingJobs) return <Loader />;

  if (!job) return <div>Job requested not found</div>;

  return (
    <div className="flex flex-col relative">
      <div className="sticky top-0">
        <Navbar />
      </div>
      <header className="w-full bg-violet-300 p-2 rounded-sm text-white">
        <div className="return">
          <RoundedButton
            content={<ArrowBack />}
            onClick={() => {
              navigate(-1);
            }}
          />
        </div>
        <div className="py-1 flex justify-around">
          <div className="about flex flex-col justify-end pb-2">
            <h1 className="font-bold text-xl capitalize">{job.title}</h1>
            <h2 className="text-neutral-700 text-sm">{company?.name}</h2>
          </div>
          <Link to={`/${company?.slug}`}  className="pic">
            <img
              src={
                company?.logo ? `${FILE_URL}/companies/${company?.id}/${company?.logo}` : "icon.png"
              }
              alt={company?.name + " logo"}
              className="w-24 h-24 object-cover rounded-md"
            />
          </Link >
        </div>
      </header>
      <main className="px-2 mt-2 flex flex-col gap-1">
        <h1 className="font-bold text-lg">Job description</h1>
        <p className="text-sm">Ref: {job.reference}</p>
        <div
          className="description | break-words"
          id="description"
          ref={descRef}
        ></div>
      </main>
    </div>
  );
}

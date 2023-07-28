import { Record } from "pocketbase";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePocket } from "../../context/pocketBaseContext";
import Navbar from "../../components/parts/Navbar";
import { FILE_URL } from "../../config/api";
import RoundedButton from "../../components/parts/RoundedButton";
import { ArrowBack } from "@mui/icons-material";
import Job from "../../components/parts/Job";
import Loader from "../../components/parts/Loader";

export default function CompanyView() {
  const { pb, getJobs } = usePocket();
  const location = useLocation();
  const companySlug = location.pathname.replaceAll("/", "");

  const [company, setCompany] = useState<Record>();
  const [isFetching, setIsFetching] = useState(true);

  const [jobs, setJobs] = useState<Array<Record>>([]);
  const [isFetchingJobs, setIsFetchingJobs] = useState(true);

  const [sorting, setSorting] = useState("+created");

  const navigate = useNavigate();

  const fetchJobs = useCallback(async (companyId: string) => {
    setIsFetchingJobs(true);
    try {
      const res = await getJobs!(1, 10, {
        filter: `company="${companyId}"`,
        sort: sorting,
      });
      setJobs(res.items);
    } catch (error: any) {
      console.warn(error.response ? error.response : error);
    }
    setIsFetchingJobs(false);
  }, [sorting]);

  const getCompany = useCallback(async () => {
    try {
      const res = await pb?.collection("companies").getList(1, 1, {
        filter: `slug="${companySlug}"`,
      });

      if (res && res.items && res.items[0]) {
        setCompany(res.items[0]);
        const companyId = res.items[0].id;
        fetchJobs(companyId);
      }
    } catch (error: any) {
      console.log(error.response ? error.response : error);
    }
    setIsFetching(false);
  }, [companySlug]);

  useEffect(() => {
    getCompany();
  }, [companySlug]);

  useEffect(() => {
    if (company) fetchJobs(company?.id);
  }, [sorting]);

  if (isFetching) return <Loader />;

  if (!company) return <div>Company requested is not found</div>;

  return (
    <div className="flex flex-col relative">
      <div className="sticky top-0">
        <Navbar />
      </div>
      <header className="w-full bg-sky-300 p-2 rounded-sm text-white">
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
            <h1 className="font-bold text-xl capitalize">{company.name}</h1>
            <h2 className="text-neutral-700 text-sm">{company.based_at}</h2>
          </div>
          <div className="pic">
            <img
              src={
                company.logo ? `${FILE_URL}/companies/${company.id}/${company.logo}` : "icon.png"
              }
              alt={company.name + " logo"}
              className="w-24 h-24 object-cover rounded-md"
            />
          </div>
        </div>
      </header>
      <main className="px-2 mt-2 flex flex-col gap-3">
        <div className="available">
          <h1 className="font-bold text-lg">Jobs available</h1>
          <div className="sort w-full flex gap-2 overflow-scroll scroll-smooth pb-2">
            <button
              className="p-2 px-3 border text-sm rounded-full text-neutral-600"
              onClick={() => {
                setSorting("-created");
              }}
            >
              Newest
            </button>
            <button
              className="p-2 px-3 border text-sm rounded-full text-neutral-600"
              onClick={() => {
                setSorting("+created");
              }}
            >
              Oldest
            </button>
          </div>
          <div className="jobs | flex flex-col gap-2">
            {isFetchingJobs ? (
              <p className="w-full text-center">Loading...</p>
            ) : jobs.length > 0 ? (
              jobs.map((job) => {
                return (
                  <Job
                    id={job.id}
                    title={job.title}
                    companyId={company.id}
                    companyName={company.name}
                    companySlug={company.slug}
                    companyBasedAt={company.based_at}
                    companyLogo={company.logo}
                    key={job.id}
                  />
                );
              })
            ) : (
              <p className="w-full text-center">No Jobs yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

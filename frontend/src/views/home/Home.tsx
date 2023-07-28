import { FormEvent, useCallback, useEffect, useState } from "react";
import { usePocket } from "../../context/pocketBaseContext";
import { Link, useNavigate } from "react-router-dom";
import { Record } from "pocketbase";
import Navbar from "../../components/parts/Navbar";
import Search from "@mui/icons-material/Search";
import Company from "../../components/parts/Company";
import Job from "../../components/parts/Job";

const Home = () => {
  const { pb, user, getJobs, getCompanies } = usePocket();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Array<Record>>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  const [jobs, setJobs] = useState<Array<Record>>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  const [searchText, setSearchText] = useState("");

  async function fetchCompanies() {
    try {
      const res = await getCompanies!(1, 4);
      setCompanies(res.items);
    } catch (error: any) {
      console.warn(error.response ? error.response : error);
    }
    setCompaniesLoading(false);
  }

  async function fetchJobs() {
    try {
      const res = await getJobs!(1, 10, {
        expand: "company",
        sort: "-created",
      });
      setJobs(res.items);
    } catch (error: any) {
      console.warn(error.response ? error.response : error);
    }
    setJobsLoading(false);
  }

  function handleSearchSubmit(e: FormEvent){
    e.preventDefault();
    navigate(`/search?q=${searchText}`)
  }

  useEffect(() => {
    fetchCompanies();
    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col relative">
      <div className="sticky top-0">
        <Navbar />
      </div>
      <main className="px-2 mt-2 flex-col gap-3 flex">
        <form
          className="flex w-full gap-2 mt-1"
          onSubmit={handleSearchSubmit}
        >
          <input
            type="text"
            name="search"
            placeholder="What are you looking for?"
            className="p-2 bg-slate-300 rounded-md w-full"
            required
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <button type="submit" className="p-2 bg-sky-500 rounded-md text-white">
            <Search />
          </button>
        </form>

        <div className="">
          <h2 className="font-bold text-lg">Popular Company</h2>
          <div className="companies | flex gap-2 overflow-x-scroll">
            {companiesLoading ? (
              <p className="w-full text-center">Loading...</p>
            ) : companies.length > 0 ? (
              companies.map((company) => {
                return (
                  <Company
                    name={company.name}
                    logoFileName={company.logo}
                    id={company.id}
                    key={company.id}
                    slug={company.slug}
                  />
                );
              })
            ) : (
              <p className="w-full text-center">No company yet.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg">Recent Jobs</h2>
          <div className="jobs | flex flex-col gap-2 ">
            {jobsLoading ? (
              <p className="w-full text-center">Loading...</p>
            ) : jobs.length > 0 ? (
              jobs.map((job) => {
                const company = job.expand.company as any;
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
};

export default Home;

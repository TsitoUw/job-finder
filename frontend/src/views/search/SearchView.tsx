import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/parts/Navbar";
import { ArrowBack, FilterAlt,  Search } from "@mui/icons-material";
import { usePocket } from "../../context/pocketBaseContext";
import { Record } from "pocketbase";
import Company from "../../components/parts/Company";
import Job from "../../components/parts/Job";
import RoundedButton from "../../components/parts/RoundedButton";

export default function SearchView() {
  const { getCompanies, getJobs } = usePocket();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [searchText, setSearchText] = useState(params.get("q") || "");

  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Array<Record>>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  const [jobs, setJobs] = useState<Array<Record>>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  async function search() {
    if (!searchText) return;
    setCompaniesLoading(true);
    setJobsLoading(true);
    try {
      const companyRes = await getCompanies!(1, 3, {
        filter: `name~"${searchText.trim()}"`,
      });
      console.log("[search c]", companyRes.items);
      if (companyRes.items) setCompanies(companyRes.items);
    } catch (error: any) {
      console.warn(error.response ? error.response : error);
    }

    try {
      const jobRes = await getJobs!(1, 3, {
        filter: `title~"${searchText.trim()}"`,
        expand: "company",
      });
      console.log("[search j]", jobRes.items);
      if (jobRes.items) setJobs(jobRes.items);
    } catch (error: any) {
      console.warn(error.response ? error.response : error);
    }
    setCompaniesLoading(false);
    setJobsLoading(false);
  }

  async function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();

    setQuery(searchText);

    navigate("/search?q=" + searchText);
  }

  useEffect(() => {
    if (query) setSearchText(query);
    search();
  }, [query]);

  useEffect(() => {
    setQuery(params.get("q") || "");
  }, []);

  return (
    <div className="flex flex-col relative">
      <div className="sticky top-0">
        <Navbar />
      </div>
      <main className="px-2 mt-2 flex-col gap-3 flex">
        <div className="return flex justify-between gap-2 items-center">
          <RoundedButton
            content={<ArrowBack />}
            onClick={() => {
              navigate("/");
            }}
            
          />
          <h2 className="text-lg font-bold">Search</h2>
        </div>
        <form className="flex w-full gap-2 mt-1" onSubmit={handleSearchSubmit}>
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
          <button className="p-2 border text-sky-500 border-sky-500 rounded-md">
            <FilterAlt />
          </button>
          <button type="submit" className="p-2 bg-sky-500 rounded-md text-white">
            <Search />
          </button>
        </form>
            
        <div className="">
          <h2 className="text-neutral-400 font-bold text-sm">Companies</h2>
          <div className="companies | flex gap-2 overflow-x-scroll">
            {companiesLoading ? (
              <p className="w-full text-center text-sm text-neutral-500">Loading...</p>
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
              <p className="w-full text-center text-sm text-neutral-500">No company found.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-neutral-400 font-bold text-sm">Jobs</h2>
          <div className="jobs | flex flex-col gap-2 ">
            {jobsLoading ? (
              <p className="w-full text-center text-sm text-neutral-500">Loading...</p>
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
              <p className="w-full text-center text-sm text-neutral-500">No Jobs yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

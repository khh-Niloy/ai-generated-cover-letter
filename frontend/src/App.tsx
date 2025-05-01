import axios, { AxiosHeaders } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [pdfUrl, setPdfUrl] = useState([]);
  const [images, setImages] = useState([]);
  const [slides, setslides] = useState([]);
  const [loading, setloading] = useState(false);
  const [open, setopen] = useState(null);
  const [selectedCoverLetterImage, setselectedCoverLetterImage] = useState("");
  const [selectedCoverLetterPDF, setselectedCoverLetterPDF] = useState("");

  async function formInput(data) {
    setloading(true);
    try {
      const res = await axios.post(
        `https://ai-generated-cover-letter-x5zk.vercel.app/generate-text`,
        data
      );
      console.log(res);
      setloading(false);
      setImages(res.data.imageUrls);
      setPdfUrl(res.data.pdfUrls);
    } catch (error) {
      if (error.message == "Network Error") {
        setloading(false);
        toast.error("The model is overloaded. Please try again later.");
      } else {
        setloading(false);
        toast.error("Something went wrong. Please try again later.");
      }
    }
  }

  useEffect(() => {
    if (images.length > 0) {
      setslides(images.map((img) => ({ src: img })));
    }
  }, [images]);

  return (
    <>
      <div className="bg-[#101010]">
        <div className="flex items-center justify-center pt-24 flex-col vite-hero-bg2">
          <h1
            className="text-7xl font-semibold text-transparent bg-clip-text bg-gradient-to-b
           from-[#f4f4f4] to-[#C0C0C0]"
          >
            AI Cover Letters
          </h1>
          <h1 className="text-7xl mt-2 font-semibold text-transparent bg-clip-text bg-gradient-to-b from-[#A1A2A2] to-[#717173]">
            Crafted for Applicants
          </h1>
          <p className="text-[#A9A9A9] text-center text-xl mt-5 inter">
            Harness AI to generate personalized, professional cover letters{" "}
            <br /> that leave a strong impression on employers.
          </p>

          <form onSubmit={handleSubmit(formInput)} className="w-[70%]">
            <div className="flex gap-10 mt-20">
              <textarea
                {...register("jobDescription", {
                  required: "*Please provide the job description",
                })}
                rows={10}
                placeholder="Paste the job description here..."
                className="relative border-b placeholder:text-white/70 custom-scrollbar focus:outline-0 place-content-end resize-none
                   text-white/90 bg-black/10 p-4 rounded-t-xl border-white/70 w-1/2"
              />
              {errors.jobDescription && (
                <span
                  className="text-md absolute bottom-8"
                  style={{ color: "red" }}
                >
                  {errors.jobDescription.message}
                </span>
              )}
              <textarea
                rows={10}
                {...register("resumeContent", {
                  required: "*Please provide the resume content",
                })}
                placeholder="Paste your resume content here..."
                className="relative border-b placeholder:text-white/70 custom-scrollbar focus:outline-0 place-content-end resize-none
                 text-white/90 bg-black/10 p-4 rounded-t-xl border-white/70 w-1/2"
              />
              {errors.resumeContent && (
                <span
                  className="text-md absolute bottom-3"
                  style={{ color: "red" }}
                >
                  {errors.resumeContent.message}
                </span>
              )}
            </div>
            <div className="pb-10 pt-16 text-center">
              <button
                className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 text-white 
            font-semibold py-3 px-3 rounded-md border-t-[1px] border-white shadow-2xl hover:scale-[1.05] duration-300 transition-transform active:scale-105 mt-7"
              >
                {loading ? "Generating..." : "Generate Cover Letter"}
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 flex-col">
            <div className="w-16 h-16 border-4 border-gray-800 border-t-purple-500 rounded-full animate-spin"></div>
            <h1 className="mt-8 text-gray-300">
              Creating your professional cover letters...
            </h1>
          </div>
        )}

        {images.length > 0 && selectedCoverLetterImage == "" ? (
          <div className="pb-20 pt-24 bg-[#101010] text-center">
            <h1 className="text-white text-center text-4xl font-medium">
              Select a Cover Letter Template
            </h1>
            <div className="flex justify-center gap-20 pt-16">
              {images.map((e, index) => (
                <div key={index} className="flex flex-col relative">
                  <h1 className="absolute bg-[#1B1C1E]/90 text-white text-xs px-3 py-2 rounded-lg top-3 left-3">
                    Tap image to view full size
                  </h1>
                  <img
                    onClick={() => setopen(index)}
                    key={index}
                    src={e}
                    className="w-[310px] h-[407px] border border-white bg-white rounded-xl"
                    alt={`cover letter ${index + 1}`}
                  />
                  <button
                    onClick={() => {
                      setselectedCoverLetterImage(e);
                      setselectedCoverLetterPDF(`${pdfUrl[index]}`);
                      setImages([]);
                    }}
                    type="button"
                    className="bg-[#1B1C1E] bg-opacity-10 hover:bg-opacity-20
                   text-gray-200 font-medium py-2 px-6 rounded-lg border-[2px] border-[#232331] 
                   transition-all duration-300 mt-6 cursor-pointer hover:bg-[#393a3e] w-full"
                  >
                    Use This Template
                  </button>
                </div>
              ))}
            </div>
            {open != null && (
              <Lightbox
                open={open != null}
                close={() => setopen(null)}
                slides={slides}
                index={open}
              />
            )}
          </div>
        ) : selectedCoverLetterImage.length > 0 ? (
          <div className="pb-20 pt-24 bg-[#101010] text-center">
            <h1 className="text-white text-4xl font-medium mb-10">
              Here is your cover letter
            </h1>
            <div className="flex justify-center">
              <img
                src={selectedCoverLetterImage}
                className="w-[310px] h-[407px] border border-white bg-white rounded-xl"
              />
            </div>
            <div className="mt-5">
              <a
                href={selectedCoverLetterPDF}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1B1C1E] bg-opacity-10 hover:bg-opacity-20
                   text-gray-200 font-medium py-3 px-20 rounded-lg border-[2px] border-[#232331] 
                   transition-all duration-300 mt-6 cursor-pointer hover:bg-[#393a3e] w-full"
              >
                Download PDF
              </a>
              <button
                onClick={() => {
                  setImages([]);
                  setselectedCoverLetterImage("");
                  setselectedCoverLetterPDF("");
                }}
                className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 text-white 
            font-semibold py-3 px-20 rounded-md border-t-[1px] border-white shadow-2xl hover:scale-[1.05] duration-300 transition-transform active:scale-105 mt-7 ml-5"
              >
                Generate again
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default App;

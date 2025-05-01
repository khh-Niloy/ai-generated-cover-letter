import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type FormData = {
  jobDescription: string;
  resumeContent: string;
};

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [pdfUrl, setPdfUrl] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [slides, setslides] = useState<{ src: string }[]>([]);
  const [loading, setloading] = useState(false);
  const [open, setopen] = useState<number | null>(null);
  const [selectedCoverLetterImage, setselectedCoverLetterImage] = useState("");
  const [selectedCoverLetterPDF, setselectedCoverLetterPDF] = useState("");

  async function formInput(data: FormData) {
    setloading(true);
    try {
      const res = await axios.post(
        `https://backend-ecru-seven-22.vercel.app/generate-text`,
        data
      );
      console.log(res);
      setloading(false);
      setImages(res.data.imageUrls);
      setPdfUrl(res.data.pdfUrls);
    } catch (error: any) {
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
        <div className="flex items-center justify-center pt-10 sm:pt-16 md:pt-20 lg:pt-24 flex-col vite-hero-bg2 px-4 sm:px-6 md:px-8">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-transparent bg-clip-text bg-gradient-to-b
           from-[#f4f4f4] to-[#C0C0C0] text-center"
          >
            AI Cover Letters
          </h1>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mt-2 font-semibold text-transparent bg-clip-text bg-gradient-to-b from-[#A1A2A2] to-[#717173] text-center">
            Crafted for Applicants
          </h1>
          <p className="text-[#A9A9A9] text-center text-base sm:text-lg md:text-xl mt-3 sm:mt-4 md:mt-5 inter px-2">
            Harness AI to generate personalized, professional cover letters{" "}
            <br className="hidden sm:block" /> that leave a strong impression on
            employers.
          </p>

          <form
            onSubmit={handleSubmit(formInput)}
            className="w-full sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[70%]"
          >
            <div className="flex flex-col md:flex-row gap-5 sm:gap-6 md:gap-8 lg:gap-10 mt-10 sm:mt-14 md:mt-16 lg:mt-20">
              <textarea
                {...register("jobDescription", {
                  required: "*Please provide the job description",
                })}
                rows={10}
                placeholder="Paste the job description here..."
                className="relative border-b placeholder:text-white/70 custom-scrollbar focus:outline-0 place-content-end resize-none
                     text-white/90 bg-black/10 p-3 sm:p-4 rounded-t-xl border-white/70 w-full"
              />
              {errors.jobDescription && (
                <span
                  className="text-xs sm:text-sm md:text-md absolute bottom-2 sm:bottom-4 md:bottom-8 left-2"
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
                   text-white/90 bg-black/10 p-3 sm:p-4 rounded-t-xl border-white/70 w-full"
              />
              {errors.resumeContent && (
                <span
                  className="text-xs sm:text-sm md:text-md absolute bottom-2 sm:bottom-4 md:bottom-8 left-2"
                  style={{ color: "red" }}
                >
                  {errors.resumeContent.message}
                </span>
              )}
            </div>
            <div className="pb-6 sm:pb-8 md:pb-10 pt-8 sm:pt-10 md:pt-12 lg:pt-16 text-center">
              <button
                className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 text-white 
              font-semibold py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 rounded-md border-t-[1px] border-white shadow-2xl hover:scale-[1.05] duration-300 transition-transform active:scale-105 mt-4 sm:mt-5 md:mt-7"
              >
                {loading ? "Generating..." : "Generate Cover Letter"}
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-10 sm:py-12 md:py-16 flex-col">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-gray-800 border-t-purple-500 rounded-full animate-spin"></div>
            <h1 className="mt-6 sm:mt-7 md:mt-8 text-gray-300 text-sm sm:text-base md:text-lg">
              Creating your professional cover letters...
            </h1>
          </div>
        )}

        {images.length > 0 && selectedCoverLetterImage == "" ? (
          <div className="pb-10 sm:pb-14 md:pb-16 lg:pb-20 pt-12 sm:pt-16 md:pt-20 lg:pt-24 bg-[#101010] text-center px-4 sm:px-6">
            <h1 className="text-white text-center text-2xl sm:text-3xl md:text-4xl font-medium">
              Select a Cover Letter Template
            </h1>
            <div className="flex flex-col sm:flex-row justify-center flex-wrap gap-10 sm:gap-12 md:gap-16 lg:gap-20 pt-8 sm:pt-10 md:pt-12 lg:pt-16">
              {images.map((e, index) => (
                <div
                  key={index}
                  className="flex flex-col relative mx-auto sm:mx-0"
                >
                  <h1 className="absolute bg-[#1B1C1E]/90 text-white text-xs px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg top-2 sm:top-3 left-2 sm:left-3">
                    Tap image to view full size
                  </h1>
                  <img
                    onClick={() => setopen(index)}
                    key={index}
                    src={e}
                    className="w-[250px] h-[330px] sm:w-[280px] sm:h-[368px] md:w-[310px] md:h-[407px] border border-white bg-white rounded-xl"
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
                     text-gray-200 font-medium py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg border-[2px] border-[#232331] 
                     transition-all duration-300 mt-4 sm:mt-5 md:mt-6 cursor-pointer hover:bg-[#393a3e] w-full"
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
          <div className="pb-10 sm:pb-14 md:pb-16 lg:pb-20 pt-12 sm:pt-16 md:pt-20 lg:pt-24 bg-[#101010] text-center px-4 sm:px-6">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-medium mb-6 sm:mb-8 md:mb-10">
              Here is your cover letter
            </h1>
            <div className="flex justify-center">
              <img
                src={selectedCoverLetterImage}
                className="w-[250px] h-[330px] sm:w-[280px] sm:h-[368px] md:w-[310px] md:h-[407px] border border-white bg-white rounded-xl"
              />
            </div>
            <div className="mt-5 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5">
              <a
                href={selectedCoverLetterPDF}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1B1C1E] bg-opacity-10 hover:bg-opacity-20
                     text-gray-200 font-medium py-2 sm:py-3 px-10 sm:px-16 md:px-20 rounded-lg border-[2px] border-[#232331] 
                     transition-all duration-300 cursor-pointer hover:bg-[#393a3e] w-full sm:w-auto"
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
              font-semibold py-2 sm:py-3 px-10 sm:px-16 md:px-20 rounded-md border-t-[1px] border-white shadow-2xl hover:scale-[1.05] duration-300 transition-transform active:scale-105 w-full sm:w-auto"
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

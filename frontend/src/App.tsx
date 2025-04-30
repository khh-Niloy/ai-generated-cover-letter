import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function App() {
  const { register, handleSubmit } = useForm();
  const [pdfUrl, setPdfUrl] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setloading] = useState(false);

  async function formInput(data) {
    console.log(data);
    setloading(true);
    const res = await axios.post("http://localhost:8000/generate-text", data);
    console.log(res);
    setloading(false);
    setImages(res.data.imageUrls);
    setPdfUrl(res.data.pdfUrls);
  }

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
                {...register("jobDescription")}
                rows={10}
                placeholder="Paste the job description here..."
                className="border-b placeholder:text-white/70 custom-scrollbar focus:outline-0 place-content-end resize-none
                 text-white/90 bg-black/10 p-4 rounded-t-xl border-white/70 w-1/2"
              />
              <textarea
                rows={10}
                {...register("resumeContent")}
                placeholder="Paste your resume content here..."
                className="border-b placeholder:text-white/70 custom-scrollbar focus:outline-0 place-content-end resize-none
                 text-white/90 bg-black/10 p-4 rounded-t-xl border-white/70 w-1/2"
              />
            </div>
            <div className="py-10 text-center">
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

        {images.length > 0 && (
          <div className="pb-20 pt-32 bg-[#101010] text-center">
            <h1 className="text-white text-center text-4xl font-medium">
              Choose your cover letter
            </h1>
            <div className="flex justify-center gap-20 pt-16">
              {images.map((e, index) => (
                <div key={index} className="flex flex-col">
                  <img
                    key={index}
                    src={e}
                    className="w-[310px] h-[407px] border border-white bg-white rounded-xl"
                    // alt={`cover letter ${index + 1}`}
                  />
                  <a target="_blank" href={`${pdfUrl[index]}`}>
                    <button
                      className="bg-[#1B1C1E] bg-opacity-10 hover:bg-opacity-20
                   text-gray-200 font-medium py-2 px-6 rounded-lg border-[2px] border-[#232331] 
                   transition-all duration-300 mt-6 cursor-pointer hover:bg-[#2e2f32] w-full"
                    >
                      Download PDF
                    </button>
                  </a>
                </div>
              ))}
            </div>
            <button
              onClick={() => setImages([])}
              className="bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 text-white 
            font-semibold py-3 px-20 rounded-md border-t-[1px] border-white shadow-2xl hover:scale-[1.05] duration-300 transition-transform active:scale-105 mt-7"
            >
              Generate again
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

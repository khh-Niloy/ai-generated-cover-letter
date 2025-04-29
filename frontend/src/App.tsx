import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

function App() {
  const { register, handleSubmit } = useForm();
  const [pdfUrl, setPdfUrl] = useState([]);
  const [images, setImages] = useState([]);

  async function formInput(data) {
    console.log(data);
    const res = await axios.post("http://localhost:8000/generate-text", data);
    console.log(res);
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

          <form onSubmit={handleSubmit(formInput)} className="w-[60%]">
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
                className="bg-gradient-to-tl from-[#BB5EE9] via-[#8258B6] to-[#6ab9ea] text-white 
            font-semibold py-3 px-3 rounded-md border-t-[1px] border-white shadow-2xl hover:scale-[1.05] duration-300 transition-transform active:scale-105"
              >
                Generate Cover Letter
              </button>
            </div>
          </form>
        </div>
        <div className="flex justify-center gap-20 pb-20 pt-10 vite-hero-bg">
          {images.map((e, index) => (
            <img
              key={index}
              src={e}
              className="w-[310px] h-[407px] border border-white"
              alt="hi"
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;

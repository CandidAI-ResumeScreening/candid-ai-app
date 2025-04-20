//src/app/components/home-components/Testimonial.jsx

const Testimonial = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <p className="text-4xl font-bold text-white">80%</p>
            <p className="mt-2 text-xl text-blue-100">
              Reduction in Screening Time
            </p>
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-white">95%</p>
            <p className="mt-2 text-xl text-blue-100">
              Accuracy in Candidate Matching
            </p>
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-white">40%</p>
            <p className="mt-2 text-xl text-blue-100">
              Increased Diversity in Hiring
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;

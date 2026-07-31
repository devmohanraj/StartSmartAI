function RiskAssessment() {
  return (
    <div className="flex justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-100 tracking-tight mb-2">Risk Assessment</h2>
        <p className="text-sm text-gray-300 leading-relaxed max-w-sm mx-auto">
          Risk analysis and evaluation will be displayed here based on the submitted project data.
        </p>
      </div>
    </div>
  );
}

export default RiskAssessment;
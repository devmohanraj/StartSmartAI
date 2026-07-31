function ProjectSummary({ project, onReset }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-sm p-6 h-125  flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-sm font-semibold text-white">Project Details</h3>
        <button
          onClick={onReset}
          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          New project
        </button>
      </div>

        <div className="flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-4">
          <div>
            <p className="text-[11px] text-gray-300 uppercase tracking-wider mb-1">Project</p>
            <p className="text-sm font-medium text-white">{project.projectName}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-300 uppercase tracking-wider mb-1">Industry</p>
            <p className="text-sm text-gray-200">{project.projectType}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-300 uppercase tracking-wider mb-1">Business Model</p>
            <p className="text-sm text-gray-200">{project.businessModel}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-300 uppercase tracking-wider mb-1">Target Market</p>
            <p className="text-sm text-gray-200">{project.targetMarket}</p>
          </div>
          {project.budget && (
            <div>
              <p className="text-[11px] text-gray-300 uppercase tracking-wider mb-1">Budget</p>
              <p className="text-sm text-gray-200">{Number(project.budget).toLocaleString()} INR</p>
            </div>
          )}
        </div>

        {project.description && (
          <div>
            <p className="text-[11px] text-gray-300 uppercase tracking-wider mb-1">Description</p>
            <p className="text-sm text-gray-300 leading-relaxed">{project.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectSummary;
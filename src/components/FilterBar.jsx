const FilterBar = ({ subjects, filters, onFilterChange }) => {
  return (
    <div className="filter-bar">
      <select
        className="filter-select"
        value={filters.subject || ''}
        onChange={(e) => onFilterChange({ ...filters, subject: e.target.value })}
      >
        <option value="">All Subjects</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filters.priority || ''}
        onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
      >
        <option value="">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <select
        className="filter-select"
        value={filters.status || ''}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
        <option value="Revision">Revision</option>
      </select>

      <select
        className="filter-select"
        value={filters.sort || 'deadline'}
        onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
      >
        <option value="deadline">Sort by Deadline</option>
        <option value="priority">Sort by Priority</option>
        <option value="subject">Sort by Subject</option>
      </select>
    </div>
  );
};

export default FilterBar;

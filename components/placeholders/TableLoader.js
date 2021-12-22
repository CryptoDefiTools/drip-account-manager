const TableLoader = ({ headers = ['Name', 'Actions'], rowCount = 10 }) => (
    <table className="table">
        <thead className="table-head">
            <tr>
                {headers.map((header) => (
                    <th key={header} className="table-header">
                        <span className="bg-white dark:bg-gray-500 text-white dark:text-gray-500 rounded animate-pulse">
                            {header}
                        </span>
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {[...Array(rowCount).keys()].map((row) => (
                <tr key={row}>
                    {[...Array(headers.length).keys()].map((col) => (
                        <th key={col} className="px-6 py-4">
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                        </th>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

export default TableLoader;

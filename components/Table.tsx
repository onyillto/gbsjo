'use client'

import { ReactNode } from 'react'

interface Column {
  key: string
  label: string
  render?: (val: any, row: any) => ReactNode
}

interface TableProps {
  columns: Column[]
  data: any[]
}

export default function Table({ columns, data }: TableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm">No data available</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col) => (
              <th key={col.key} className="table-header-cell">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="table-cell">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

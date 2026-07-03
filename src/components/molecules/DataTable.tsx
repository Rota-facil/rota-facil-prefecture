import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DataTableColumn<TData> {
  id: string;
  header: ReactNode;
  cell: (item: TData) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<TData> {
  columns: DataTableColumn<TData>[];
  data: TData[];
  getRowId: (item: TData) => string;
  emptyMessage?: string;
  pageSize?: number;
}

export default function DataTable<TData>({
  columns,
  data,
  getRowId,
  emptyMessage = "Nenhum registro encontrado.",
  pageSize = 10,
}: DataTableProps<TData>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, pageSize, safeCurrentPage]);

  const firstItem =
    data.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const lastItem = Math.min(safeCurrentPage * pageSize, data.length);

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)]">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    "px-6 py-3.5 text-left",
                    column.headerClassName,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((item) => (
              <tr
                key={getRowId(item)}
                className="transition-colors hover:bg-slate-50/80"
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      "px-6 py-4 align-middle text-slate-700",
                      column.className,
                    )}
                  >
                    {column.cell(item)}
                  </td>
                ))}
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#E5EAF0] bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500">
          Mostrando {firstItem}-{lastItem} de {data.length} registro(s)
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="h-7 w-11 cursor-pointer rounded-xl border-[#E5EAF0] text-slate-600 hover:bg-[#EEF2F7] disabled:cursor-not-allowed"
            aria-label="Página anterior"
            disabled={safeCurrentPage === 1}
            onClick={() => goToPage(safeCurrentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex min-w-25 h-7 items-center justify-center rounded-xl border border-[#E5EAF0] bg-[#FAFBFC] px-4 py-2 text-sm font-semibold text-slate-700">
            {safeCurrentPage} / {totalPages}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="h-7 w-11 cursor-pointer rounded-xl border-[#E5EAF0] text-slate-600 hover:bg-[#EEF2F7] disabled:cursor-not-allowed"
            aria-label="Próxima página"
            disabled={safeCurrentPage === totalPages}
            onClick={() => goToPage(safeCurrentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

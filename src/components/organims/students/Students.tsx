"use client";

import { MessageSquareText, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import StudentStatusBadge from "@/components/atom/StudentStatusBadge";
import DataTable, {
  type DataTableColumn,
} from "@/components/molecules/DataTable";
import UserFeedbackModal from "@/components/molecules/feedbacks/UserFeedbackModal";
import StudentFilters, {
  type StudentFrequencyFilter,
  type StudentScoreFilter,
} from "@/components/molecules/students/StudentFilters";
import { listStudents } from "@/service/UserService";
import type { StudentEntity } from "@/types/entites/StudentEntity";

const PAGE_SIZE = 6;

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getFrequencyBarColor(frequency: number) {
  if (frequency >= 90) {
    return "bg-emerald-500";
  }

  if (frequency >= 75) {
    return "bg-[#3B82F6]";
  }

  return "bg-[#DC2626]";
}

function matchesScoreFilter(
  student: StudentEntity,
  filter: StudentScoreFilter,
) {
  if (filter === "ALL") {
    return true;
  }

  if (filter === "HIGH") {
    return student.score >= 4;
  }

  if (filter === "MEDIUM") {
    return student.score >= 3 && student.score < 4;
  }

  return student.score < 3;
}

function matchesFrequencyFilter(
  student: StudentEntity,
  filter: StudentFrequencyFilter,
) {
  if (filter === "ALL") {
    return true;
  }

  if (filter === "EXCELLENT") {
    return student.frequency >= 90;
  }

  if (filter === "ATTENTION") {
    return student.frequency >= 75 && student.frequency < 90;
  }

  return student.frequency < 75;
}

export default function Students() {
  const [scoreFilter, setScoreFilter] = useState<StudentScoreFilter>("ALL");
  const [frequencyFilter, setFrequencyFilter] =
    useState<StudentFrequencyFilter>("ALL");
  const [students, setStudents] = useState<StudentEntity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<StudentEntity>();
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchStudents() {
      const response = await listStudents(currentPage - 1, PAGE_SIZE);
      setStudents(response.content);
      setTotalItems(response.page.totalElements);
      setTotalPages(response.page.totalPages);
    }

    fetchStudents();
  }, [currentPage]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      return (
        matchesScoreFilter(student, scoreFilter) &&
        matchesFrequencyFilter(student, frequencyFilter)
      );
    });
  }, [students, scoreFilter, frequencyFilter]);

  const columns: DataTableColumn<StudentEntity>[] = [
    {
      id: "student",
      header: "Aluno",
      cell: (student) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-blue-500 text-xs font-bold text-white shadow-sm">
            {getInitials(student.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {student.name}
            </p>
            <p className="font-mono text-[11px] text-slate-400">
              {student.code}
            </p>
          </div>
        </div>
      ),
      className: "min-w-64",
    },
    {
      id: "email",
      header: "Email",
      cell: (student) => (
        <span className="font-mono text-xs text-slate-600">
          {student.email}
        </span>
      ),
      className: "min-w-72",
    },
    {
      id: "frequency",
      header: "Frequência",
      cell: (student) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${getFrequencyBarColor(
                student.frequency,
              )}`}
              style={{ width: `${student.frequency}%` }}
            />
          </div>
          <span className="w-9 text-xs font-semibold text-slate-700">
            {student.frequency}%
          </span>
        </div>
      ),
      className: "min-w-44",
    },
    {
      id: "score",
      header: "Score",
      cell: (student) => (
        <div className={"flex justify-center items-center gap-1"}>
          <span className="font-mono text-xs font-semibold text-slate-700">
            {student.score.toFixed(1)}
          </span>

          <Star
            className={"fill-amber-500 text-amber-500 mb-0.5"}
            size={"14"}
            fill={"100"}
          />
        </div>
      ),
      className: "text-center",
      headerClassName: "text-center",
    },
    {
      id: "feedbacks",
      header: "Feedbacks",
      cell: (student) => (
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-[#1E3A8A] transition-colors hover:bg-blue-50"
          onClick={() => setSelectedStudent(student)}
        >
          <MessageSquareText className="h-3.5 w-3.5" />
          Ver feedbacks
        </button>
      ),
      className: "text-center",
      headerClassName: "text-center",
    },
    {
      id: "status",
      header: "Status",
      cell: (student) => <StudentStatusBadge status={student.status} />,
      className: "text-right",
      headerClassName: "text-right",
    },
  ];

  return (
    <div className="-m-5 flex min-h-[calc(100vh-4rem)] flex-col gap-6 bg-slate-50 px-6 py-6">
      <div>
        <p className="text-3xl font-bold tracking-tight text-slate-950">
          Alunos
        </p>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Acompanhe frequência, score e status dos alunos cadastrados no
          transporte escolar municipal.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <StudentFilters
          score={scoreFilter}
          frequency={frequencyFilter}
          onScoreChange={setScoreFilter}
          onFrequencyChange={setFrequencyFilter}
        />
        <p className="text-sm font-medium text-slate-500">
          {filteredStudents.length} aluno(s) encontrado(s)
        </p>
      </div>

      <DataTable
        columns={columns}
        data={filteredStudents}
        getRowId={(student) => student.id}
        emptyMessage="Nenhum aluno encontrado para os filtros selecionados."
        pageSize={PAGE_SIZE}
        currentPage={currentPage}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {selectedStudent && (
        <UserFeedbackModal
          userId={selectedStudent.id}
          userName={selectedStudent.name}
          onClose={() => setSelectedStudent(undefined)}
        />
      )}
    </div>
  );
}

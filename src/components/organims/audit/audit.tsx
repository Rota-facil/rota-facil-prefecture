"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AuditActionBadge from "@/components/atom/AuditActionBadge";
import AuditRoleBadge from "@/components/atom/AuditRoleBadge";
import AuditFilters, {
  type AuditActionFilter,
  type AuditResourceFilter,
  type AuditRoleFilter,
} from "@/components/molecules/audit/AuditFilters";
import DataTable, {
  type DataTableColumn,
} from "@/components/molecules/DataTable";
import { env } from "@/config/env";
import { listAudits } from "@/service/AuditService";
import type { AuditEntity } from "@/types/entites/AuditEntity";

function matchesRoleFilter(auditLog: AuditEntity, filter: AuditRoleFilter) {
  if (filter === "ALL") {
    return true;
  }

  return auditLog.role === filter;
}

function matchesActionTypeFilter(
  auditLog: AuditEntity,
  filter: AuditActionFilter,
) {
  if (filter === "ALL") {
    return true;
  }

  return auditLog.actionType === filter;
}

function matchesResourceFilter(
  auditLog: AuditEntity,
  filter: AuditResourceFilter,
) {
  if (filter === "ALL") {
    return true;
  }

  return auditLog.resourceName === filter;
}

export default function Audit() {
  const [auditLogs, setAuditLogs] = useState<AuditEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<AuditRoleFilter>("ALL");
  const [actionTypeFilter, setActionTypeFilter] =
    useState<AuditActionFilter>("ALL");
  const [resourceFilter, setResourceFilter] =
    useState<AuditResourceFilter>("ALL");

  useEffect(() => {
    let active = true;

    async function loadAudits() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await listAudits();

        if (active) {
          setAuditLogs(data);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Erro ao carregar registros de auditoria",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadAudits();

    return () => {
      active = false;
    };
  }, []);

  const resourceOptions = useMemo(() => {
    const uniqueResources = new Set(
      auditLogs.map((auditLog) => auditLog.resourceName),
    );
    return Array.from(uniqueResources);
  }, [auditLogs]);

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(
      (auditLog) =>
        matchesRoleFilter(auditLog, roleFilter) &&
        matchesActionTypeFilter(auditLog, actionTypeFilter) &&
        matchesResourceFilter(auditLog, resourceFilter),
    );
  }, [auditLogs, roleFilter, actionTypeFilter, resourceFilter]);

  const columns: DataTableColumn<AuditEntity>[] = [
    {
      id: "user",
      header: "Usuário",
      cell: (auditLog) => (
        <span className="text-sm font-semibold text-slate-800">
          {auditLog.email}
        </span>
      ),
      className: "min-w-56",
    },
    {
      id: "role",
      header: "Perfil",
      cell: (auditLog) => <AuditRoleBadge role={auditLog.role} />,
      className: "min-w-32",
    },
    {
      id: "title",
      header: "Título",
      cell: (auditLog) => (
        <span className="text-sm text-slate-600">{auditLog.actionTitle}</span>
      ),
      className: "min-w-96",
    },
    {
      id: "actionType",
      header: "Ação",
      cell: (auditLog) => <AuditActionBadge actionType={auditLog.actionType} />,
      className: "min-w-32",
    },
    {
      id: "resource",
      header: "Recurso",
      cell: (auditLog) => (
        <span className="text-sm text-slate-600">{auditLog.resourceName}</span>
      ),
      className: "min-w-28",
    },
    {
      id: "date",
      header: "Data",
      cell: (auditLog) => (
        <span className="font-mono text-xs text-slate-500">
          {auditLog.date}
        </span>
      ),
      className: "min-w-32",
    },
  ];

  const tableEmptyMessage = error
    ? error
    : isLoading
      ? "Carregando registros de auditoria..."
      : "Nenhum registro encontrado para os filtros selecionados.";

  return (
    <div className="-m-5 flex min-h-[calc(100vh-4rem)] flex-col gap-6 bg-slate-50 px-6 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-slate-950">
            Auditoria
          </p>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Histórico imutável de todas as ações realizadas na plataforma.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5EAF0] bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5 text-[#1E3A8A]" />
          Registros somente leitura
        </span>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <AuditFilters
          role={roleFilter}
          actionType={actionTypeFilter}
          resource={resourceFilter}
          resourceOptions={resourceOptions}
          onRoleChange={setRoleFilter}
          onActionTypeChange={setActionTypeFilter}
          onResourceChange={setResourceFilter}
        />
        <p className="text-sm font-medium text-slate-500">
          {filteredAuditLogs.length} registro(s) encontrado(s)
        </p>
      </div>

      <DataTable
        columns={columns}
        data={isLoading || error ? [] : filteredAuditLogs}
        getRowId={(auditLog) => auditLog.id}
        emptyMessage={tableEmptyMessage}
        pageSize={6}
      />
    </div>
  );
}

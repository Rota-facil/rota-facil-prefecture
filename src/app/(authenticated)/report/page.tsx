"use client";

import { useEffect } from "react";
import { getGrafanaUrl } from "@/config/env";

export default function ReportPage() {
  useEffect(() => {
    window.location.replace(getGrafanaUrl());
  }, []);

  return null;
}

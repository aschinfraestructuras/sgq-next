'use client';

import React from 'react';
import { MaterialForm } from '@/components/materials/MaterialForm';
import { MaterialList } from '@/components/materials/MaterialList';
import { MaterialDashboard } from '@/components/materials/MaterialDashboard';
import { useMaterials } from '@/hooks/useMaterials';
import { useTranslation } from '@/hooks/useTranslation';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";

export default function MaterialsPage() {
  const { t } = useTranslation();
  const { materials, loading, error, stats } = useMaterials();
  const [activeTab, setActiveTab] = React.useState("dashboard");

  const data = [
    {
      label: t('materials.tabs.dashboard'),
      value: "dashboard",
      content: <MaterialDashboard stats={stats} loading={loading} error={error} />,
    },
    {
      label: t('materials.tabs.list'),
      value: "list",
      content: <MaterialList materials={materials} loading={loading} error={error} />,
    },
    {
      label: t('materials.tabs.new'),
      value: "new",
      content: <MaterialForm />,
    },
  ];

  return (
    <div className="h-full w-full p-4">
      <Tabs value={activeTab}>
        <TabsHeader>
          {data.map(({ label, value }) => (
            <Tab key={value} value={value} onClick={() => setActiveTab(value)}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {data.map(({ value, content }) => (
            <TabPanel key={value} value={value}>
              {content}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
}
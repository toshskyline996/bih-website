import { useState, createContext, useContext, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * BIH Tabs 组件
 * 
 * 工业极简风格的 Tab 切换器
 * 用于 Steel Spec 页面的多维度技术数据展示
 */

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType>({
  activeTab: '',
  setActiveTab: () => {},
});

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        'flex overflow-x-auto border-b-2 border-bih-gray-200 gap-0 -mx-4 px-4 sm:mx-0 sm:px-0',
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        'px-3 py-3 text-xs sm:px-6 sm:text-sm font-bold uppercase tracking-wider transition-colors -mb-[2px] border-b-2 whitespace-nowrap',
        isActive
          ? 'border-bih-yellow text-bih-navy bg-bih-yellow/10'
          : 'border-transparent text-bih-gray-500 hover:text-bih-navy hover:border-bih-gray-300',
        className
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className={cn('pt-6', className)}>{children}</div>;
}

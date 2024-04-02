export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 p-5 max-w-[100vw] bg-gray-100 dark:bg-gray-800">
      <div className="flex flex-1 p-4 rounded-xl overflow-auto bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-50">
        {children}
      </div>
    </div>
  );
}

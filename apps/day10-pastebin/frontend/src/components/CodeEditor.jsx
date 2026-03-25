export function CodeEditor({ value, onChange, placeholder = "Enter your code here...", autoFocus = false }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="w-full min-h-[300px] p-4 bg-gray-900 text-gray-100 font-mono text-sm rounded-lg border border-gray-700 resize-y focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      spellCheck={false}
    />
  )
}
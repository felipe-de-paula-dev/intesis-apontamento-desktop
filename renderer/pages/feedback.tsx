import { LucideIcon, Clock, ShieldAlert } from "lucide-react";

interface FeedbackProps {
  color: "emerald" | "blue" | "rose" | "amber";
  title: string;
  subtitle: string;
  timeLogin?: string;
  icon: LucideIcon;
  message?: string;
}

export default function FeedbackScreen({ color, title, subtitle, timeLogin, icon: Icon, message }: FeedbackProps) {
  
  const colorVariants = {
    emerald: { bg: "bg-emerald-500", text: "text-emerald-500", shadow: "shadow-emerald-100" },
    blue: { bg: "bg-blue-500", text: "text-blue-500", shadow: "shadow-blue-100" },
    rose: { bg: "bg-rose-500", text: "text-rose-500", shadow: "shadow-rose-100" },
    amber: { bg: "bg-amber-500", text: "text-amber-500", shadow: "shadow-amber-100" },
  };

  const selectedColor = colorVariants[color] || colorVariants.emerald;

  return (
    <div className="bg-white flex flex-col items-center justify-center rounded-3xl w-[90%] max-w-md p-8 md:p-10 text-center shadow-2xl animate-in fade-in">
      
      <div className={`w-24 h-24 ${selectedColor.bg} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${selectedColor.shadow}`}>
        <Icon className="w-12 h-12 text-white stroke-[2.5px]" />
      </div>

      <h1 className={`text-4xl font-black ${selectedColor.text} mb-1 tracking-tight uppercase`}>
        {title}
      </h1>
      
      <p className={`text-lg text-gray-500 font-medium ${timeLogin ? 'mb-6' : 'mb-0'} ${message ? 'mb-2' : ''}`}>
        {subtitle}
      </p>

      {timeLogin && (<div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center">
        <span className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">
          <Clock className="w-4 h-4" /> Registro de Entrada
        </span>
        <div className="text-5xl font-black text-gray-900 tracking-tight">
          {timeLogin}
        </div>
      </div>
      )}

      {message && (
        <div className={`mt-6 inline-flex items-center gap-2 ${selectedColor.text} font-bold uppercase text-[16px] tracking-wider animate-pulse`}>
          {message}
        </div>
      )}
    </div>
  );
}
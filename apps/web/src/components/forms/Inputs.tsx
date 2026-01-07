"use client";

import { clsx } from "clsx";

export function InputField(props: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="text-xs text-white/60">{props.label}{props.required ? " *" : ""}</div>
      <input
        name={props.name}
        type={props.type ?? "text"}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue as any}
        required={props.required}
        className={clsx(
          "mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm",
          "outline-none focus:ring-2 focus:ring-white/20"
        )}
      />
    </label>
  );
}

export function SelectField(props: {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="text-xs text-white/60">{props.label}{props.required ? " *" : ""}</div>
      <select
        name={props.name}
        defaultValue={props.defaultValue}
        required={props.required}
        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
      >
        {props.options.map(o => (
          <option key={o.value} value={o.value} className="bg-[#0b1120]">{o.label}</option>
        ))}
      </select>
    </label>
  );
}

export function TextAreaField(props: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs text-white/60">{props.label}</div>
      <textarea
        name={props.name}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        rows={4}
        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
      />
    </label>
  );
}

import React from 'react';
import { CaretRight, House } from '@phosphor-icons/react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-[#423341]/70 font-body">
        <li className="flex items-center gap-1.5">
          <a
            href="/"
            className="hover:text-[#A7B596] transition-colors flex items-center gap-1"
          >
            <House size={14} />
            <span>Home</span>
          </a>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <CaretRight size={12} className="text-[#423341]/40" />
              {isLast || !item.href ? (
                <span className="font-semibold text-[#423341]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="hover:text-[#A7B596] transition-colors"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

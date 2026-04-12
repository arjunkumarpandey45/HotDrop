import React, { useState } from 'react';

function PostDescription({ description }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 99;

  if (description.length <= maxLength) {
    return <p className="text-[12px] text-slate-900 pb-3 font-medium leading-relaxed">{description}</p>;
  }

  return (
    <div className="relative">
      <p className="text-[12px] text-slate-900 pb-3 font-medium leading-relaxed">
        {isExpanded ? description : `${description.slice(0, maxLength)}`}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-1 text-[11px] text-slate-400 hover:text-blue-600 font-bold transition-colors cursor-pointer inline-block"
        >
          {isExpanded ? '  ..Show Less' : '  ...Read More'}
        </button>
      </p>
    </div>
  );
}

export default PostDescription;

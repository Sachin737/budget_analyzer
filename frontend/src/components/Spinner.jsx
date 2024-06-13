import React from "react";

const Spinner = () => (
  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-text-bottom text-danger motion-reduce:animate-spin_1.5s_linear_infinite">
    <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 clip-hidden">
      Loading...
    </span>
  </div>
);

export { Spinner };

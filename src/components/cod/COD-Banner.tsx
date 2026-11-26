// import React from "react";

// interface CODBannerProps {
//   titleTop?: string;
//   subtitle?: string;
//   crumbs?: string[];
// }

// const CODBanner: React.FC<CODBannerProps> = ({
//   titleTop = "COD Available",
//   subtitle = "Pay when your order arrives at your doorstep. Simple, safe, and no advance payment needed.",
//   crumbs = ["Home", "COD Available"],
// }) => {
//   return (
//     <section className="about-banner">
//       <div className="about-banner__crumb">
//         {crumbs.map((c, i) => (
//           <React.Fragment key={c}>
//             {i > 0 && <span className="about-banner__sep">/</span>}
//             <span className={i === crumbs.length - 1 ? "is-active" : ""}>
//               {c.toUpperCase()}
//             </span>
//           </React.Fragment>
//         ))}
//       </div>

//       <div className="about-banner__content">
//         <h1 className="about-banner__title">
//           <span className="line line--accent">{titleTop}</span>
//         </h1>
//       </div>

//       <p className="about-banner__subtitle">{subtitle}</p>
//     </section>
//   );
// };

// export default CODBanner;
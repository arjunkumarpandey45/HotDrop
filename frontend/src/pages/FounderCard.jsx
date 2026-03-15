import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Globe, X, ExternalLink, InstagramIcon } from "lucide-react";

const FounderCard = ({ type, name, role, image, bio, github, linkedin,instagram, portfolio }) => {

  const [openImage, setOpenImage] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="group relative h-full"
      >

        {/* Soft Glow */}
        <div className="absolute -inset-[1px] rounded-[1.8rem] bg-gradient-to-br from-blue-300/40 via-blue-100/30 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition duration-500"/>

        {/* Card */}
        <div className="relative h-full rounded-[1.8rem] p-8 border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-blue-100 backdrop-blur-xl shadow-sm group-hover:shadow-2xl transition-all duration-500 overflow-hidden">

          {/* Shine */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700">
            <div className="absolute -left-40 top-0 w-40 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent rotate-12 translate-x-[-100%] group-hover:translate-x-[300%] transition duration-[1200ms]" />
          </div>

          {/* Badge */}
          <div className="mb-6 inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-blue-100 text-blue-600">
            {type}
          </div>

          <div className="flex flex-col gap-6 relative z-10">

            {/* Avatar */}
            <motion.img
              whileHover={{ scale: 1.07 }}
              src={image}
              alt={name}
              onClick={() => setOpenImage(true)}
              className="w-20 h-20 rounded-xl object-cover cursor-pointer border border-blue-100 shadow-md"
            />

            {/* Name */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {name}
              </h3>

              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mt-1">
                {role}
              </p>
            </div>

            {/* Bio */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {bio}
            </p>

            {/* Footer */}
            <div className="mt-auto pt-6 flex items-center justify-between">

              <div className="flex gap-4">

                <IconLink href={github}>
                  <Github size={18}/>
                </IconLink>

                <IconLink href={linkedin}>
                  <Linkedin size={18}/>
                </IconLink>

                <IconLink href={portfolio}>
                  <Globe size={18}/>
                </IconLink>
 <IconLink href={instagram}>
                  <InstagramIcon size={18}/>
                </IconLink>
              </div>

              

            </div>

          </div>

        </div>
      </motion.div>

      {/* Image Preview */}
      <AnimatePresence>
        {openImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50990 flex items-center justify-center p-6"
            onClick={() => setOpenImage(false)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={image}
              className="max-h-[80vh] rounded-2xl shadow-2xl"
            />

            <button
              onClick={() => setOpenImage(false)}
              className="absolute top-6 right-6 text-white"
            >
              <X size={28}/>
            </button>

          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

const IconLink = ({ href, children }) => (
  <motion.a
    whileHover={{ y: -2, scale: 1.05 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-slate-400 hover:text-blue-600 transition"
  >
    {children}
  </motion.a>
);

export default FounderCard;
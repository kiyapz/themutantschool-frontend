// components/ClientLayoutWrapper.jsx
'use client';



export default function ClientLayoutWrapper({ children }) {
  return <GloblaxcontexProvider>{children}</GloblaxcontexProvider>;
}

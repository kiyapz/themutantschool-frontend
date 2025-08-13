import MissionCard from "./components/MissionCard";

export default function Page() {
  const missioncard = [
    {
      id: 1,
      image:
        "https://www.milesweb.com/blog/wp-content/uploads/2024/10/how-to-create-a-website-using-html.png",
      text1: "Web Development Mastery",
      text2: "Learn HTML, CSS, and JavaScript step by step.",
      text3: "1 / 5",
      bg: "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]",
    },
    {
      id: 2,
      image: "https://i.ytimg.com/vi/qz0aGYrrlhU/maxresdefault.jpg",
      text1: "Create Your Mutant Account",
      text2: "Join the Mutant School community today!",
      text3: "2 / 5",
      bg: "bg-gradient-to-r from-[#231926] to-[#194034]",
    },
    {
      id: 3,
      image:
        "https://www.cantech.in/blog/wp-content/uploads/2024/03/What-is-HTML-958x575.webp",
      text1: "Graphic Design Essentials",
      text2: "Master Photoshop, Illustrator, and Canva.",
      text3: "3 / 5",
      bg: "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]",
    },
    {
      id: 4,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuyS1G-GCaHlO9VKgdPNVkeO6tQdCawoFnGg&s",
      text1: "Cybersecurity Basics",
      text2: "Learn how to protect yourself online.",
      text3: "4 / 5",
      bg: "bg-gradient-to-r from-[#231926] to-[#5D1D49]",
    },
  ];

  return (
    <>
      {missioncard.length === 0 ? (
        "No Available Mission"
      ) : (
        <div className="flex flex-col gap-5">
          {missioncard.map((item) => (
            <MissionCard
              key={item.id}
              image={item.image}
              text1={item.text1}
              text2={item.text2}
              text3={item.text3}
                bg={item.bg}
            />
          ))}
        </div>
      )}
    </>
  );
}

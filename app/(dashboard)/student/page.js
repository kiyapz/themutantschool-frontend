export default function page(params) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      Student Page
      <p className="text-center text-2xl font-bold">
        Welcome to the Student Page
      </p>
      <p className="text-center text-lg">
        Here you can view your courses and assignments
      </p>
      <p className="text-center text-md">
        Please select an option from the menu
      </p>
    </div>
  );
}

function ImageCorosel() {
  return (
    <div className="flex-1 p-8">
      <div className="flex overflow-x-auto space-x-4">
        <div
          className="w-full h-64 bg-cover bg-center rounded-lg shadow-md"
          style={{
            backgroundImage:
              "url('https://uppsc.org.in/wp-content/uploads/2022/10/Ration-Card-Status-Maharashtra-1024x683.png')",
          }}
        ></div>
        <div
          className="w-full h-64 bg-cover bg-center rounded-lg shadow-md"
          style={{
            backgroundImage:
              "url('https://th.bing.com/th/id/OIP.nWr2Hyoh0s8wBQ0WqkBgmQHaEK?w=286&h=180&c=7&r=0&o=5&pid=1.7')",
          }}
        ></div>
        <div
          className="w-full h-64 bg-cover bg-center rounded-lg shadow-md"
          style={{
            backgroundImage:
              "url('https://th.bing.com/th/id/OIP.LLjhNMeKdji3Pnd77ITKPgHaE8?w=248&h=180&c=7&r=0&o=5&pid=1.7')",
          }}
        ></div>
      </div>
    </div>
  );
}

export default ImageCorosel;

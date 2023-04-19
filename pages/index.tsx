import React, { useState } from "react";
import * as z from "zod";
import { schema } from "@/pages/validation/schema";

const IndexPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    init: "",
  });

  // handleValidation handles the input fields validation with zod
  const handleValidation = () => {
    try {
      schema.parse({ name, email });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: { [key: string]: string } = {};

        error.errors.forEach((error) => {
          const field = error.path.join(".");
          errorMap[field] = error.message;
        });
        setErrors(errorMap);
      }
    }
  };

  // handleSubmit handles form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // invokes the validation before proceed to HTTP Post
    handleValidation();

    // proceed to HTTP POST if there is no errors from validation
    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch("api/form-submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        });
        const data = await response.json();
        console.log(data); // handle server response
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onBlur={handleValidation}
          onChange={(event) => setName(event.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.name && (
          <p className="text-red-500 text-xs italic">{errors.name}</p>
        )}
      </div>
      <div className="mb-6">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onBlur={handleValidation}
          onChange={(event) => setEmail(event.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.email && (
          <p className="text-red-500 text-xs italic">{errors.email}</p>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};

export default IndexPage;

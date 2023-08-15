import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { RiEmotionSadLine } from "react-icons/ri";
import Fuse from "fuse.js";
import Link from "next/link";
import Head from "next/head";

const HomePage = ({ initialAIData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiData, setAIData] = useState(initialAIData);

  useEffect(() => {
    axios
      .get("/api/data")
      .then((response) => {
        setAIData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching AI data:", error);
      });
  }, []);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const fuse = new Fuse(aiData, {
    keys: ["name", "description", "tags"],
    threshold: 0.4,
  });

  const filteredAIs = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : aiData;

  return (
    <Fragment>
      <Head>
        <title>AI Finder: Discover the Perfect AI Tool</title>
        <meta
          name="description"
          content="Explore our collection of AI models and tools for various applications."
        />
        <meta
          name="keywords"
          content="AI models, AI tools, machine learning, artificial intelligence"
        />
      </Head>
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <HeroSection />
          <SearchBar handleSearch={handleSearch} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredAIs.length > 0 ? (
              filteredAIs.map((ai, index) => <AICard key={index} ai={ai} />)
            ) : (
              <div className="w-full flex flex-col items-center justify-center mt-8">
                <RiEmotionSadLine className="text-gray-400 text-4xl mb-2" />
                <p className="text-center text-gray-600 text-lg">
                  No AI models match your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const HeroSection = () => (
  <section className="text-center mt-12">
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
      AI Finder: Discover the Perfect AI Tool
    </h1>
    <p className="text-gray-600">
      Explore our collection of AI models and tools for various applications.
    </p>
  </section>
);

const SearchBar = ({ handleSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    handleSearch(value);
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="relative">
        <input
          type="text"
          className="border rounded px-4 py-3 w-full md:w-96 lg:w-80 xl:w-96 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search AI models, tools or anything..."
          value={searchInput}
          onChange={handleChange}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 max-md:hidden">
          <FiSearch />
        </div>
      </div>
    </div>
  );
};

const AICard = ({ ai }) => (
  <motion.div
    className="bg-white shadow-lg rounded-lg p-6 mt-6 hover:shadow-xl transition duration-300"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Link href={ai.url}>
      <img
        src={ai.image}
        alt={ai.name}
        className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full"
      />
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
        {ai.name}
      </h2>
      <p className="text-gray-600 mt-2">{ai.description}</p>
      <div className="mt-3">
        {ai.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs mr-2"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  </motion.div>
);

export async function getServerSideProps() {
  try {
    const response = await axios.get("/api/data");
    const initialAIData = response.data;
    return {
      props: {
        initialAIData,
      },
    };
  } catch (error) {
    console.error("Error fetching AI data:", error);
    return {
      props: {
        initialAIData: [],
      },
    };
  }
}

export default HomePage;

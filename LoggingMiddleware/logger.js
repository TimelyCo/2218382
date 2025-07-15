import axios from "axios";

const log = async (stack, level, pkg, message, token) => {
  try {
    await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Logging failed:", error.message);
  }
};

export default log;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/calculate", (req, res) => {
  const { items, incomes } = req.body;

  // Validate incoming data
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid items data" });
  }
  if (!incomes || !Array.isArray(incomes) || incomes.length === 0) {
    return res.status(400).json({ error: "Invalid incomes data" });
  }

  try {
    const results = items.map((item) => {
      const contributions = item.splits.map((split, index) => {
        // Calculate based on custom splits if enabled, else use income-based calculation
        return item.customSplitEnabled
          ? ((split / 100) * item.totalAmount).toFixed(2)
          : ((incomes[index] / incomes.reduce((a, b) => a + b, 0)) * item.totalAmount).toFixed(2);
      });
      return {
        description: item.description,
        totalAmount: item.totalAmount,
        contributions,
      };
    });

    res.json({ results });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "An error occurred while calculating the split" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

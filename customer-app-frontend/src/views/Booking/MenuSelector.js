import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  IconButton,
  Box,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useTheme } from "@mui/material/styles";
import { axios } from "axios";

const MenuSelector = () => {
  const theme = useTheme();
  const cardWidth = "100%";

  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl =
      "https://vdvua9bvw8.execute-api.us-east-1.amazonaws.com/prod/get-menu-items";

    // Define the request data to be sent in the request body
    const requestData = {
      restaurantId: 12, // Replace with the appropriate value
    };

    axios
      .post(apiUrl, requestData) // Use the post method and send the requestData in the request body
      .then((response) => {
        setRestaurants(JSON.parse(response.data.body));
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  const handleAdd = (menuItem) => {
    // Handle adding to cart or updating quantity
  };

  const handleRemove = (menuItem) => {
    // Handle removing from cart or updating quantity
  };

  return (
    <Container>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <Grid container spacing={2}>
          {restaurants.map((restaurant) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={restaurant.menu_id}
              name="menuSelectorGrid"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
                name="cardDiv"
              >
                {restaurant.items.map((menuItem) => (
                  <Card
                    style={{ width: cardWidth, marginBottom: theme.spacing(2) }}
                    key={menuItem.item_id}
                  >
                    <CardMedia
                      component="img"
                      alt={menuItem.item_name}
                      height="140"
                      image={menuItem.item_image_url}
                    />
                    <div style={{ flex: 1 }}>
                      <CardContent>
                        <Typography variant="h6">
                          {menuItem.item_name}
                        </Typography>
                        <Typography>{menuItem.description}</Typography>
                        <Typography>
                          Price: ${parseFloat(menuItem.price).toFixed(2)}
                        </Typography>
                        <Typography>
                          Category: {menuItem.category.join(", ")}
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <IconButton onClick={() => handleRemove(menuItem)}>
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="h6">0</Typography>{" "}
                          <IconButton onClick={() => handleAdd(menuItem)}>
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MenuSelector;

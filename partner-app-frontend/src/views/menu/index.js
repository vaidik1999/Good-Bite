import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const MenuDisplay = () => {
  const [menuData, setMenuData] = useState(null);
  const [mainToggle, setMainToggle] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [menuDiscountRate, setMenuDiscountRate] = useState('');  
  const [editedItem, setEditedItem] = useState({
    itemName: '',
    category: [],
    description: '',
    itemDiscount: false,
    itemDiscountRate: '',
    itemId: '',
    itemImageUrl: '',
  });

  const [showAddMenuItemForm, setShowAddMenuItemForm] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: '',
    category: [],
    description: '',
    itemDiscount: false,
    itemDiscountRate: '',
    itemId: '',
    itemImageUrl: '',
  });

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('https://8nqal5q4sf.execute-api.us-east-1.amazonaws.com/view-menu?menu_id=sushank7@abc.com_Tawa%20Grill_menu');
        const data = await response.json();
        setMenuData(data);

        setMainToggle(data.menu_discount);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    fetchMenuData();
  }, []);

  const handleMainToggle = async () => {
    setMainToggle((prevMainToggle) => {
      // Use the previous state to determine the new state
      const newMainToggle = !prevMainToggle;
  
      if (!newMainToggle) {
        const updatedMenuData = {
          menu_id: menuData.menu_id,
          menu_discount: newMainToggle,
          menu_discount_rate: "0.0",
          res_id: menuData.res_id,
          items: [...menuData.items],
        };
  
        // Assuming `editMenu` is an asynchronous function
        editMenu(updatedMenuData);
      }
  
      return newMainToggle; // Return the new state
    });
  };

  const handleEditClick = (index) => {
    setEditForm(index);

    setEditedItem({
      itemName: menuData.items[index].item_name,
      category: menuData.items[index].category.map((cat) => cat),
      description: menuData.items[index].description,
      itemDiscount: menuData.items[index].item_discount,
      itemDiscountRate: menuData.items[index].item_discount_rate,
      itemId: menuData.items[index].item_id,
      itemImageUrl: menuData.items[index].item_image_url,
    });
  };

  const handleEditCancel = () => {
    setEditForm(null);
  };

  const editMenu = async (updatedData) => {
    try {
      const response = await fetch('https://8nqal5q4sf.execute-api.us-east-1.amazonaws.com/edit-menu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to edit menu');
      }

      // Handle success (e.g., show a success message)
      console.log('Menu edited successfully');
      window.location.reload();
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error('Error editing menu:', error.message);
      window.location.reload();
    }
  };

  const handleEditSave = () => {
    const updatedMenuItem = {
      category: editedItem.category.map((cat) => cat),
      description: editedItem.description,
      item_discount: editedItem.itemDiscount,
      item_discount_rate: editedItem.itemDiscountRate,
      item_id: editedItem.itemId,
      item_image_url: editedItem.itemImageUrl,
      item_name: editedItem.itemName,
    };
  
    const updatedMenuData = {
      menu_id: menuData.menu_id,
      menu_discount: mainToggle, // Use the current state of mainToggle
      menu_discount_rate: menuData.menu_discount_rate,
      res_id: menuData.res_id,
      items: [...menuData.items],
    };
  
    updatedMenuData.items[editForm] = updatedMenuItem;
  
    // Call the editMenu function to update the backend
    editMenu(updatedMenuData);
    
  };
//------------------------------------
  const handleAddMenuItem = () => {
    console.log('Add menu item clicked');
    setShowAddMenuItemForm(true);
  };

  const handleAddMenuFormClose = () => {
    setShowAddMenuItemForm(false);
  };

  const handleAddMenuSave = () => {
    const newItemData = {
      category: newItem.category.map((cat) => cat),
      description: newItem.description,
      item_discount: newItem.itemDiscount,
      item_discount_rate: newItem.itemDiscountRate,
      item_id: newItem.itemId,
      item_image_url: newItem.itemImageUrl,
      item_name: newItem.itemName,
    };
  
    const updatedMenuData = {
      menu_id: menuData.menu_id,
      menu_discount: mainToggle, 
      menu_discount_rate: menuData.menu_discount_rate,
      res_id: menuData.res_id,
      items: [...menuData.items, newItemData],
    };
  
    
    editMenu(updatedMenuData);
    
  };

  const handleDeleteClick = async (index) => {
    try {
      const itemToDelete = menuData.items[index];
      const deleteApiUrl = 'https://8nqal5q4sf.execute-api.us-east-1.amazonaws.com/delete-menu';
  
      const response = await fetch(deleteApiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menu_id: menuData.menu_id,
          item_id: itemToDelete.item_id,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }
  
      console.log('Menu item deleted successfully');
      window.location.reload(); 
    } catch (error) {
      console.error('Error deleting menu item:', error.message);
      window.location.reload(); 
    }
  };
  

  if (!menuData) {
    return <div>Loading...</div>;
  }

  const handleSaveMenuDiscountRate = () => {
    const updatedMenuData = {
      menu_id: menuData.menu_id,
      menu_discount: mainToggle,
      menu_discount_rate: menuDiscountRate, 
      res_id: menuData.res_id,
      items: [...menuData.items],
    };

    editMenu(updatedMenuData);
    //window.location.reload();
  };


  
  return (
    <div className="container mt-4">
      <h1>{menuData.menu_id}</h1>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="mainToggle"
          checked={mainToggle}
          onChange={handleMainToggle}
        />
        <label className="form-check-label" htmlFor="mainToggle">
         Menu Discount
        </label>
      </div>
      <p>Menu Discount: {menuData.menu_discount ? 'Yes' : 'No'}</p>
      <p>Menu Discount Rate: {menuData.menu_discount_rate}</p>

      {mainToggle && (
        <div className="mb-3">
          <label htmlFor="menuDiscountRate" className="form-label">
            Menu Discount Rate
          </label>
          <input
            type="text"
            className="form-control"
            id="menuDiscountRate"
            value={menuDiscountRate}  
            onChange={(e) => setMenuDiscountRate(e.target.value)}           
            />
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={handleSaveMenuDiscountRate}
          >
            Save
          </button>
        </div>
      )}
      

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {menuData.items.map((item, index) => (
          <div key={index} className="col">
            <div className="card">
              <div className="row g-0">
                <div className="col-md-6">
                  <div className="card-body">
                    <h5 className="card-title">{item?.item_name}</h5>
                    <p className="card-text">{item?.description}</p>
                    <p className="card-text">Category: {item?.category.map((category) => category).join(', ')}</p>
                    <p className="card-text">Item Discount: {item?.item_discount ? 'Yes' : 'No'}</p>
                    <p className="card-text">Item Discount Rate: {item?.item_discount_rate}</p>
                    <p className="card-text">Item ID: {item?.item_id}</p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleEditClick(index)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger ms-2"
                      onClick={() => handleDeleteClick(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="col-md-6">
                  <img src={item?.item_image_url} className="img-fluid rounded-end" alt={item?.item_name} />
                </div>
              </div>
            </div>

            {editForm === index && (
              <div className="card mt-2">
                <div className="card-body">
                  <label htmlFor="editItemName" className="form-label">
                    Item Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editItemName"
                    value={editedItem.itemName}
                    onChange={(e) => setEditedItem({ ...editedItem, itemName: e.target.value })}
                  />

                  <label htmlFor="editCategory" className="form-label">
                    Category
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editCategory"
                    value={editedItem.category.join(', ')}
                    onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value.split(', ') })}
                  />

                  <label htmlFor="editDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="editDescription"
                    value={editedItem.description}
                    onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                  />

                  <label htmlFor="editItemDiscount" className="form-label">
                    Item Discount
                  </label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="editItemDiscount"
                      checked={editedItem.itemDiscount}
                      onChange={() => {
                        if (!mainToggle) {
                          setEditedItem({ ...editedItem, itemDiscount: !editedItem.itemDiscount });
                        }
                      }}
                      disabled={mainToggle}
                    />
                    <label className="form-check-label" htmlFor="editItemDiscount" disabled={mainToggle}>
                      Apply Item Discount
                    </label>
                  </div>

                  <label htmlFor="editItemDiscountRate" className="form-label">
                    Item Discount Rate
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editItemDiscountRate"
                    value={editedItem.itemDiscountRate}
                    onChange={(e) => {
                      if (!mainToggle) {
                        setEditedItem({ ...editedItem, itemDiscountRate: e.target.value });
                      }
                    }}
                    disabled={mainToggle}
                  />

                  <label htmlFor="editItemId" className="form-label">
                    Item ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editItemId"
                    value={editedItem.itemId}
                    onChange={(e) => setEditedItem({ ...editedItem, itemId: e.target.value })}
                  />

                  <label htmlFor="editItemImageUrl" className="form-label">
                    Item Image URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editItemImageUrl"
                    value={editedItem.itemImageUrl}
                    onChange={(e) => setEditedItem({ ...editedItem, itemImageUrl: e.target.value })}
                  />

                  <button type="button" className="btn btn-secondary mt-2" onClick={handleEditCancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary mt-2" onClick={handleEditSave}>
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      
      <div className="row mt-4">
        <div className="col text-center">
          <button type="button" className="btn btn-success" onClick={handleAddMenuItem}>
            Add Menu Item
          </button>
          
        </div>
      </div>
      
      
        {showAddMenuItemForm && (
          <div className="card mt-4">
            <div className="card-body">
              <h3>Add Menu Item</h3>

              <label htmlFor="addItemName" className="form-label">
                Item Name
              </label>
              <input
                type="text"
                className="form-control"
                id="addItemName"
                value={newItem.itemName}
                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
              />

              <label htmlFor="addCategory" className="form-label">
                Category
              </label>
              <input
                type="text"
                className="form-control"
                id="addCategory"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value.split(', ') })}
              />

              <label htmlFor="addDescription" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="addDescription"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />

              <label htmlFor="addItemDiscount" className="form-label">
                Item Discount
              </label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="addItemDiscount"
                  checked={newItem.itemDiscount}
                onChange={(e) => {
                  if (!mainToggle) {
                  setNewItem({ ...newItem, itemDiscount: !newItem.itemDiscount });
                }
              }}
              disabled={mainToggle}
                />
                <label className="form-check-label" htmlFor="addItemDiscount">
                  Apply Item Discount
                </label>
              </div>

              <label htmlFor="addItemDiscountRate" className="form-label">
                Item Discount Rate
              </label>
              <input
                type="text"
                className="form-control"
                id="addItemDiscountRate"
                value={newItem.itemDiscountRate}
                onChange={(e) => {
                  if (!mainToggle) {
                  setNewItem({ ...newItem, itemDiscountRate: e.target.value });
                }
              }}
              disabled={mainToggle}
                />

              <label htmlFor="addItemId" className="form-label">
                Item ID
              </label>
              <input
                type="text"
                className="form-control"
                id="addItemId"
                value={newItem.itemId}
                onChange={(e) => setNewItem({ ...newItem, itemId: e.target.value })}
              />

              <label htmlFor="addItemImageUrl" className="form-label">
                Item Image URL
              </label>
              <input
                type="text"
                className="form-control"
                id="addItemImageUrl"
                value={newItem.itemImageUrl}
                onChange={(e) => setNewItem({ ...newItem, itemImageUrl: e.target.value })}
              />

      <button type="button" className="btn btn-secondary mt-2" onClick={handleAddMenuFormClose}>
        Close
      </button>
      <button type="button" className="btn btn-primary mt-2" onClick={handleAddMenuSave}>
        Save
      </button>
      
    </div>
    
  </div>
  
)}
              

    </div>
  );
};
export default MenuDisplay;

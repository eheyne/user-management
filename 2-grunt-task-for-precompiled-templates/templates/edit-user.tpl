<form class="edit-user-form">
  <legend><%= user ? 'Update' : 'Create' %> User</legend>
  <label>First Name</label>
  <input type="text" name="firstname" value="<%= user ? user.get('firstname') : '' %>"/>
  <label>Last Name</label>
  <input type="text" name="lastname" value="<%= user ? user.get('lastname') : '' %>"/>
  <label>Age</label>
  <input type="text" name="age" value="<%= user ? user.get('age') : '' %>"/>
  <hr />
  <button type="submit" class="btn"><%= user ? 'Update' : 'Create' %></button>
  <% if(user) { %>
    <input type="hidden" name="id"  value="<%= user.id %>" />
    <button class="btn btn-danger delete">Delete</button>
  <% }; %>
</form>

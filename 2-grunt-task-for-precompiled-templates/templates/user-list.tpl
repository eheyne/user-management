<a href="#/new" class="btn btn-primary">New User</a>
<hr />
<table class="table table-striped">
<thead>
  <tr>
    <th>First Name</th>
    <th>Last Name</th>
    <th>Age</th>
    <th></th>
  </tr>
</thead>
<tbody>
  <% _.each(users, function(user) { %>
    <tr>
      <td><%= user.get('firstname') %></td>
      <td><%= user.get('lastname') %></td>
      <td><%= user.get('age') %></td>
      <td><a href="#/edit/<%= user.id %>" class="btn">Edit</a></td>
    </tr>
  <% }); %>
</tbody>


<template>
  <v-container>
    <!-- Título -->
    <v-row>
      <v-col class="text-left">
        <VuetifyLogo />
      </v-col>
      <v-col class="text-center">
        <h1 class="text-center">Gestión de usuarios protegida</h1>
      </v-col>
      <!-- Aquí ira la información del usuario -->
      <v-col class="text-right">
        <v-card outlined class="pa-4" v-if="userData">
          <v-card-title>
            <h3>Información del Usuario</h3>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <p class="mb-2">
                  <strong>Correo Electrónico:</strong> {{ userData.correo }}
                </p>
                <p class="mb-2"><strong>DUI:</strong> {{ userData.dui }}</p>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="error" @click="logout">
              <v-icon left>mdi-logout</v-icon>
              Cerrar Sesión
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Barra de búsqueda y botón -->
    <v-row align="center" justify="space-between" class="mb-4">
      <!-- Barra de búsqueda -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Buscar usuarios"
          outlined
          clearable
          prepend-inner-icon="mdi-magnify"
        />
      </v-col>

      <!-- Botón de agregar usuario -->
      <v-col cols="12" md="3" class="text-right">
        <v-btn color="primary" @click="addUser">
          <v-icon left>mdi-plus</v-icon>
          Agregar usuario
        </v-btn>
      </v-col>
    </v-row>

    <!-- Tabla de usuarios -->
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="users"
          :search="search"
          class="elevation-1"
          item-value="id"
          :item-class="getRowClass"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon color="primary" @click="editUser(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="error" @click="deleteUser(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon color="warning" @click="changeState(item)">
              <v-icon>mdi-alert-circle</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Modal para agregar usuario -->
    <v-dialog v-model="showAddUserModal" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Agregar Usuario</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="addUserForm" v-model="formValid">
            <v-text-field
              v-model="newUser.nombre"
              label="Nombre"
              outlined
              required
            />
            <v-text-field
              v-model="newUser.correo"
              label="Correo Electrónico"
              outlined
              required
            />
            <v-text-field
              v-model="newUser.clave"
              label="Contraseña"
              outlined
              type="password"
              required
            />
            <v-text-field
              v-model="newUser.telefono"
              label="Teléfono"
              outlined
              v-maska="'####-####'"
            />
            <v-text-field
              v-model="newUser.dui"
              label="DUI"
              outlined
              v-maska="'########-#'"
            />
            <v-textarea
              v-model="newUser.direccion"
              label="Dirección"
              outlined
            />
            <v-text-field
              v-model="newUser.nacimiento"
              label="Fecha de Nacimiento"
              outlined
              type="date"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showAddUserModal = false"
            >Cancelar</v-btn
          >
          <v-btn color="blue darken-1" text @click="createUser">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showEditUserModal" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Editar Usuario</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="editUserForm" v-model="formValid">
            <v-text-field
              v-model="selectedUser.nombre"
              label="Nombre"
              outlined
              required
            />
            <v-text-field
              v-model="selectedUser.correo"
              label="Correo Electrónico"
              outlined
              required
            />
            <v-text-field
              v-model="selectedUser.telefono"
              label="Teléfono"
              outlined
              v-maska="'####-####'"
            />
            <v-text-field
              v-model="selectedUser.dui"
              label="DUI"
              outlined
              v-maska="'########-#'"
            />
            <v-textarea
              v-model="selectedUser.direccion"
              label="Dirección"
              outlined
            />
            <v-text-field
              v-model="selectedUser.nacimiento"
              label="Fecha de Nacimiento"
              outlined
              type="date"
            />
            <v-checkbox
              v-model="selectedUser.estado"
              label="Estado del usuario"
              outlined
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showEditUserModal = false"
            >Cancelar</v-btn
          >
          <v-btn color="blue darken-1" text @click="updateUser">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
    
    <script>
import AxiosRequest from "@/utils/AxiosRequest";
import useVuelidate from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { vMaska } from "maska/vue";
import VuetifyLogo from "@/components/VuetifyLogo.vue";

export default {
  data() {
    return {
      search: "",
      showAddUserModal: false,
      showEditUserModal: false,
      formValid: false,
      isModalOpen: false,
      userData: null,
      headers: [
        { title: "ID", value: "id", align: "start" },
        { title: "Nombre", value: "name" },
        { title: "Correo Electrónico", value: "email" },
        { title: "Teléfono", value: "phone" },
        { title: "Estado", value: "state" },
        { title: "Acciones", value: "actions", sortable: false },
      ],
      users: [],
      newUser: {
        nombre: "",
        correo: "",
        clave: "",
        telefono: "",
        dui: "",
        direccion: "",
        nacimiento: "",
      },
      selectedUser: {
        id: "",
        nombre: "",
        correo: "",
        telefono: "",
        dui: "",
        direccion: "",
        nacimiento: "",
        estado: "",
      },
    };
  },
  components: {
    VuetifyLogo,
  },
  validations() {
    return {
      newUser: {
        nombre: {
          required,
          minLength: helpers.withMessage(
            "El nombre debe tener al menos 3 caracteres",
            (value) => value.length >= 3
          ),
        },
        correo: {
          required,
          email: helpers.withMessage(
            "Debes ingresar un correo válido",
            (value) => /.+@.+\..+/.test(value)
          ),
        },
        clave: { required },
        telefono: {
          required,
          $params: {
            telefono: { mask: "####-####" },
          },
        },
        dui: {
          required,
          $params: {
            dui: { mask: "########-#" },
          },
        },
        direccion: { required },
        nacimiento: { required },
      },
      selectedUser: {
        nombre: { required },
        correo: { required, email },
        clave: { required },
        telefono: {
          required,
          $params: {
            telefono: { mask: "####-####" },
          },
        },
        dui: {
          required,
          $params: {
            dui: { mask: "########-#" },
          },
        },
        direccion: { required },
        nacimiento: { required },
      },
    };
  },
  directives: {
    maska: vMaska,
  },
  created() {
    this.fetchUsers();
    this.fetchUserData();
    this.$v = useVuelidate();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await AxiosRequest(
          "/usuarios_private/private/usuarios",
          "R"
        );
        const data = response.dataset;
        this.users = data.map((user) => ({
          id: user.ID,
          name: user.NOMBRE,
          email: user.CORREO,
          phone: user.TELÉFONO,
          dui: user.DUI,
          address: user.DIRECCIÓN,
          birthdate: user.NACIMIENTO,
          state_value: user.VALOR_ESTADO,
          state: user.ESTADO,
        }));
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    },
    async fetchUserData() {
      try {
        const response = await AxiosRequest(
          "/usuarios_private/private/usuario",
          "R"
        );
        // Acceder al primer elemento del dataset
        const user = response.dataset[0];

        this.userData = {
          correo: user.correo,
          dui: user.dui,
        };
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    },
    logout() {
      // Aquí puedes manejar la lógica de cerrar sesión
      console.log("Cerrando sesión...");
      this.$router.push("/");
      // Por ejemplo, redirigir al login o limpiar el estado de la sesión
    },
    async createUser() {
      try {
        await AxiosRequest(
          "/usuarios_private/private/usuarios",
          "C",
          this.newUser
        );
        this.fetchUsers();
        this.showAddUserModal = false;
        this.clearNewUserForm();
      } catch (error) {
        console.error("Error al crear el usuario:", error);
      }
    },
    async updateUser() {
      try {
        this.selectedUser.estado = this.selectedUser.estado ? 1 : 0;
        await AxiosRequest(
          `/usuarios_private/private/usuarios/${this.selectedUser.id}`,
          "U",
          this.selectedUser
        );
        this.fetchUsers(); // Recargar los usuarios para reflejar los cambios
        this.showEditUserModal = false; // Cerrar el modal
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
      }
    },
    getRowClass(item) {
      console.log(item);
      return item.state_value === 1 ? "row-green" : "row-red";
    },
    addUser() {
      this.showAddUserModal = true;
    },
    editUser(user) {
      this.selectedUser = {
        id: user.id,
        nombre: user.name,
        correo: user.email,
        telefono: user.phone,
        dui: user.dui,
        direccion: user.address,
        nacimiento: user.birthdate,
        estado: user.state_value === 1,
      };
      this.showEditUserModal = true;
    },
    async deleteUser(user) {
      try {
        await AxiosRequest(
          `/usuarios_private/private/usuarios/${user.id}`,
          "D"
        );
        this.fetchUsers();
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    },
    async changeState(user) {
      try {
        await AxiosRequest(
          `/usuarios_private/private/usuarios/${user.id}/state`,
          "P"
        );
        this.fetchUsers();
      } catch (error) {
        console.error("Error al editar el estado del usuario:", error);
      }
    },
    clearNewUserForm() {
      this.newUser = {
        nombre: "",
        correo: "",
        clave: "",
        telefono: "",
        dui: "",
        direccion: "",
        nacimiento: "",
      };
    },
  },
};
</script>
    
  <style scoped>
h1 {
  font-weight: bold;
  margin-bottom: 20px;
}
.row-green {
  border: 2px solid green;
}
.row-red {
  border: 2px solid red;
}
.blue--text {
  color: blue;
  font-size: 2rem;
}
</style>
    
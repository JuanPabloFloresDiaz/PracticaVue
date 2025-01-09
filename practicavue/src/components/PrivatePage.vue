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
            <v-btn icon color="error" @click="confirmDeleteUser(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon color="warning" @click="confirmChangeState(item)">
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
          <v-form ref="addUserForm">
            <v-text-field
              v-model="newUser.nombre"
              label="Nombre"
              outlined
              required
              :error="v$.newUser.nombre.$invalid"
              :error-messages="v$.newUser.nombre.$errors.map((e) => e.$message)"
              @input="v$.newUser.nombre.$touch()"
              @blur="v$.newUser.nombre.$touch()"
            />
            <v-text-field
              v-model="newUser.correo"
              label="Correo Electrónico"
              outlined
              required
              :error="v$.newUser.correo.$invalid"
              :error-messages="v$.newUser.correo.$errors.map((e) => e.$message)"
              @input="v$.newUser.correo.$touch()"
              @blur="v$.newUser.correo.$touch()"
            />
            <v-text-field
              v-model="newUser.clave"
              label="Contraseña"
              outlined
              type="password"
              required
              :error="v$.newUser.clave.$invalid"
              :error-messages="v$.newUser.clave.$errors.map((e) => e.$message)"
              @input="v$.newUser.clave.$touch()"
              @blur="v$.newUser.clave.$touch()"
            />
            <v-text-field
              v-model="newUser.telefono"
              label="Teléfono"
              outlined
              v-maska="'####-####'"
              :error="v$.newUser.telefono.$invalid"
              :error-messages="
                v$.newUser.telefono.$errors.map((e) => e.$message)
              "
              @input="v$.newUser.telefono.$touch()"
              @blur="v$.newUser.telefono.$touch()"
            />
            <v-text-field
              v-model="newUser.dui"
              label="DUI"
              outlined
              v-maska="'########-#'"
              :error="v$.newUser.dui.$invalid"
              :error-messages="v$.newUser.dui.$errors.map((e) => e.$message)"
              @input="v$.newUser.dui.$touch()"
              @blur="v$.newUser.dui.$touch()"
            />
            <v-textarea
              v-model="newUser.direccion"
              label="Dirección"
              outlined
              :error="v$.newUser.direccion.$invalid"
              :error-messages="
                v$.newUser.direccion.$errors.map((e) => e.$message)
              "
              @input="v$.newUser.direccion.$touch()"
              @blur="v$.newUser.direccion.$touch()"
            />
            <v-text-field
              v-model="newUser.nacimiento"
              label="Fecha de Nacimiento"
              outlined
              type="date"
              :error="v$.newUser.nacimiento.$invalid"
              :error-messages="
                v$.newUser.nacimiento.$errors.map((e) => e.$message)
              "
              @input="v$.newUser.nacimiento.$touch()"
              @blur="v$.newUser.nacimiento.$touch()"
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
          <v-form ref="editUserForm">
            <v-text-field
              v-model="selectedUser.nombre"
              label="Nombre"
              outlined
              required
              :error="v$.selectedUser.nombre.$invalid"
              :error-messages="v$.selectedUser.nombre.$errors.map((e) => e.$message)"
              @input="v$.selectedUser.nombre.$touch()"
              @blur="v$.selectedUser.nombre.$touch()"
            />
            <v-text-field
              v-model="selectedUser.correo"
              label="Correo Electrónico"
              outlined
              required
              :error="v$.selectedUser.correo.$invalid"
              :error-messages="v$.selectedUser.correo.$errors.map((e) => e.$message)"
              @input="v$.selectedUser.correo.$touch()"
              @blur="v$.selectedUser.correo.$touch()"
            />
            <v-text-field
              v-model="selectedUser.telefono"
              label="Teléfono"
              outlined
              v-maska="'####-####'"
              :error="v$.selectedUser.telefono.$invalid"
              :error-messages="v$.selectedUser.telefono.$errors.map((e) => e.$message)"
              @input="v$.selectedUser.telefono.$touch()"
              @blur="v$.selectedUser.telefono.$touch()"
            />
            <v-text-field
              v-model="selectedUser.dui"
              label="DUI"
              outlined
              v-maska="'########-#'"
              :error="v$.selectedUser.dui.$invalid"
              :error-messages="v$.selectedUser.dui.$errors.map((e) => e.$message)"
              @input="v$.selectedUser.dui.$touch()"
              @blur="v$.selectedUser.dui.$touch()"
            />
            <v-textarea
              v-model="selectedUser.direccion"
              label="Dirección"
              outlined
              :error="v$.selectedUser.direccion.$invalid"
              :error-messages="v$.selectedUser.direccion.$errors.map((e) => e.$message)"
              @input="v$.selectedUser.direccion.$touch()"
              @blur="v$.selectedUser.direccion.$touch()"
            />
            <v-text-field
              v-model="selectedUser.nacimiento"
              label="Fecha de Nacimiento"
              outlined
              type="date"
              :error="v$.selectedUser.nacimiento.$invalid"
              :error-messages="v$.selectedUser.nacimiento.$errors.map((e) => e.$message)"
              @input="v$.selectedUser.nacimiento.$touch()"
              @blur="v$.selectedUser.nacimiento.$touch()"
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
import { validationRules } from "@/utils/Validators";
import { vMaska } from "maska/vue";
import VuetifyLogo from "@/components/VuetifyLogo.vue";
import {
  showAlert,
  confirmAction,
  confirmToastAction,
} from "@/plugins/sweetalert2";

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
        { title: "ID", key: "id", align: "start" },
        { title: "Nombre", key: "name" },
        { title: "Correo Electrónico", key: "email" },
        { title: "Teléfono", key: "phone" },
        { title: "Estado", key: "state" },
        { title: "Acciones", key: "actions", sortable: false },
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
          required: validationRules.required,
          minLength: validationRules.minLength(3),
        },
        correo: {
          required: validationRules.required,
          email: validationRules.email,
        },
        clave: {
          required: validationRules.required,
        },
        telefono: {
          required: validationRules.required,
          validTelefono: validationRules.validTelefono,
        },
        dui: {
          required: validationRules.required,
          validDui: validationRules.validDui,
        },
        direccion: {
          required: validationRules.required,
        },
        nacimiento: {
          required: validationRules.required,
        },
      },
      selectedUser: {
        nombre: {
          required: validationRules.required,
          minLength: validationRules.minLength(3),
        },
        correo: {
          required: validationRules.required,
          email: validationRules.email,
        },
        telefono: {
          required: validationRules.required,
          validTelefono: validationRules.validTelefono,
        },
        dui: {
          required: validationRules.required,
          validDui: validationRules.validDui,
        },
        direccion: {
          required: validationRules.required,
        },
        nacimiento: {
          required: validationRules.required,
        },
      },
    };
  },
  setup() {
    const v$ = useVuelidate();
    return { v$ };
  },
  directives: {
    maska: vMaska,
  },
  created() {
    this.fetchUsers();
    this.fetchUserData();
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
      this.v$.newUser.$touch(); // Marca todos los campos como tocados
      if (this.v$.newUser.$invalid) {
        // Si hay errores, no continúa
        return;
      }
      try {
        const response = await AxiosRequest(
          "/usuarios_private/private/usuarios",
          "C",
          this.newUser
        );
        showAlert({ status: true, message: response.message });
        this.fetchUsers();
        this.showAddUserModal = false;
        this.clearNewUserForm();
      } catch (error) {
        this.showAddUserModal = false;
        showAlert({ status: false, message: error.message });
      }
    },
    async updateUser() {
      this.v$.selectedUser.$touch(); // Marca todos los campos como tocados
      if (this.v$.selectedUser.$invalid) {
        // Si hay errores, no continúa
        return;
      }
      try {
        this.selectedUser.estado = this.selectedUser.estado ? 1 : 0;
        const response = await AxiosRequest(
          `/usuarios_private/private/usuarios/${this.selectedUser.id}`,
          "U",
          this.selectedUser
        );
        showAlert({ status: true, message: response.message });
        this.fetchUsers(); // Recargar los usuarios para reflejar los cambios
        this.showEditUserModal = false; // Cerrar el modal
      } catch (error) {
        this.showEditUserModal = false; // Cerrar el modal
        showAlert({ status: false, message: error.message });
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
        const response = await AxiosRequest(
          `/usuarios_private/private/usuarios/${user.id}`,
          "D"
        );
        this.fetchUsers();
        showAlert({ status: true, message: response.message });
      } catch (error) {
        showAlert({ status: false, message: error.message });
      }
    },
    async changeState(user) {
      try {
        const response = await AxiosRequest(
          `/usuarios_private/private/usuarios/${user.id}/state`,
          "P"
        );
        this.fetchUsers();
        showAlert({ status: true, message: response.message });
      } catch (error) {
        showAlert({ status: false, message: error.message });
      }
    },
    confirmDeleteUser(user) {
      confirmAction({
        title: "¿Eliminar usuario?",
        text: `Estás a punto de eliminar al usuario ${user.name}. Esta acción no puede deshacerse.`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteUser(user);
        }
      });
    },
    confirmChangeState(user) {
      confirmToastAction({
        title: `¿Cambiar el estado del usuario ${user.name}?`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.changeState(user);
        }
      });
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
    
import * as React from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Autocomplete from "@mui/material/Autocomplete";
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
//Custom Components
import MiniDrawer from "./MiniDrawer";
import { List } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { FormControlLabel } from "@mui/material";

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.75),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(3),
		width: "auto",
	},
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
}));

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",

	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

// const initialProdutosState = [
// 	{ label: "Coca-Cola 2L", id: 1 },
// 	{ label: "Coca-Cola 600ml", id: 2 },
// 	{ label: "Pizza Calabresa", id: 3 },
// 	{ label: "Pizza Frango", id: 4 },
// 	{ label: "Pizza Queijo", id: 5 },
// 	{ label: "Pizza 4 Queijos", id: 6 },
// 	{ label: "Pizza Frango com Catupiry", id: 7 }
// ]


export default function RequestPage() {
    const RequestEdit = ({ index }) => {
		const handleEditClick = () => {
			console.log(index);
			handleClickOpen(index)
		};

		return (
			<FormControlLabel
				control={
					<div>
						<IconButton color="primary" onClick={handleEditClick}>
							<EditIcon style={{ color: "#000000" }} />
						</IconButton>
						{/* <IconButton color="primary" onClick={handleDelete}>
							<DeleteIcon style={{ color: "#000000" }} />
						</IconButton> */}
					</div>
				}
			/>
		);
	};

	React.useEffect(() => {
		loadPedidos();
	}, []);

	const loadPedidos = async () => {
		fetch("/app/pedido/all?format=json")
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setPedidos(data);
				setFilteredList(data);
				setPedidosLoading(false);
				
			});
	};
	
	const columns = [
		{ field: "id", headerName: "Código", width: 90 },
		{
			field: "nomeDoCliente",
			headerName: "Nome do Cliente",
			width: 150,
			editable: false,
		},
		{
			field: "status",
			headerName: "Status",
			type: "singleSelect",
			valueGetter: ({ value }) => value && statusByNumber(value),
			valueOptions: ["Criado", "Em Preparo", "Pronto P/ Entrega", "Saiu P/ Entrega", "Entregue" ],
		},
		{
			field: "endereco",
			headerName: "Endereço",
			width: 300,
			editable: false,
		},
		{
			field: "telefone",
			headerName: "Telefone",
			type: "number",
			width: 120,
			editable: false,
		},
		{
			field: "hora",
			headerName: "Horário do Pedido",
			width: 100,
			editable: false,
		},
		{
			field: "pago",
			headerName: "Pedido Pago",
			type: "boolean",
			width: 150,
			editable: false,
		},
		{
			field: "valorTotal",
			headerName: "Valor Total",
			type: "number",
			width: 110,
			editable: false,
		},
		{
			field: "metodoPagamento",
			headerName: "Método Pagamento",
			valueGetter: ({ value }) => value && pagamentoByNumber(value),
			width: 110,
		},
		{
			field: "observacoes",
			headerName: "Observações",
			width: 100,
			editable: false,
		},
		{
			field: "entrega",
			headerName: "Necessita Entrega",
			width: "100",
			type: "boolean",
			editable: false,
		},
		{
			field: "actions",
			headerName: "Ações",
			sortable: false,
			width: 140,
			disableClickEventBubbling: true,
			renderCell: (params) => {
				return (
					<div
						className="d-flex justify-content-between align-items-center"
						style={{ cursor: "pointer" }}
					>
						<RequestEdit index={params.row} />
					</div>
				);
			},
		},
	];

	const [pedidos, setPedidos] = React.useState([]);
	const [pedidosLoading, setPedidosLoading] = React.useState(true);
	//Comente abaixo e descomente acima para iniciar pedidos zerado
	// const [pedidos, setPedidos] = React.useState([
	// 	{
	// 		id: 1,
	// 		nomeDoCliente: "Geraldo da Silva",
	// 		status: "Criado",
	// 		endereco: "Rua dos bobos, 0",
	// 		telefone: "19963521478",
	// 		hora: "12:00",
	// 		pago: true,
	// 		valorTotal: 80,
	// 		metodoPagamento: "cartão",
	// 		observacoes: "",
	// 		entrega: true,
	// 		items: [
	// 			{
	// 				label: "Coca-Cola 2L",
	// 				id: 1,
	// 				quantity:1
	// 			},
	// 			{
	// 				label: "Pizza Calabresa",
	// 				id: 3,
	// 				quantity:2
	// 			},
	// 			{
	// 				label: "Pizza Frango",
	// 				id: 4,
	// 				quantity:1
	// 			},
	// 		],
	// 		actions: "",
	// 	},
	// 	{
	// 		id: 2,
	// 		nomeDoCliente: "Geraldo da Silva",
	// 		status: "Criado",
	// 		endereco: "Rua dos bobos, 0",
	// 		telefone: "19963521478",
	// 		hora: "12:00",
	// 		pago: true,
	// 		valorTotal: 80,
	// 		metodoPagamento: "cartão",
	// 		observacoes: "",
	// 		entrega: true,
	// 		items: [
	// 			{
	// 				label: "Coca-Cola 2L",
	// 				id: 1,
	// 				quantity:1
	// 			},
	// 			{
	// 				label: "Pizza Queijo",
	// 				id: 5,
	// 				quantity:2
	// 			},
	// 			{
	// 				label: "Pizza Frango",
	// 				id: 4,
	// 				quantity:1
	// 			},
	// 		],
	// 		actions: "",
	// 	},
	// 	{
	// 		id: 3,
	// 		nomeDoCliente: "Geraldo da Silva",
	// 		status: "Criado",
	// 		endereco: "Rua dos bobos, 0",
	// 		telefone: "19963521478",
	// 		hora: "12:00",
	// 		pago: true,
	// 		valorTotal: 80,
	// 		metodoPagamento: "cartão",
	// 		observacoes: "",
	// 		entrega: true,
	// 		items: [
	// 			{
	// 				label: "Coca-Cola 2L",
	// 				id: 1,
	// 				quantity:1
	// 			},
	// 			{
	// 				label: "Pizza Calabresa",
	// 				id: 3,
	// 				quantity:2
	// 			},
	// 			{
	// 				label: "Pizza Frango",
	// 				id: 4,
	// 				quantity:1
	// 			},
	// 		],
	// 		actions: "",
	// 	},
	// 	{
	// 		id: 4,
	// 		nomeDoCliente: "Geraldo da Silva",
	// 		status: "Criado",
	// 		endereco: "Rua dos bobos, 0",
	// 		telefone: "19963521478",
	// 		hora: "12:00",
	// 		pago: true,
	// 		valorTotal: 80,
	// 		metodoPagamento: "cartão",
	// 		observacoes: "",
	// 		entrega: true,
	// 		items: [
	// 			{
	// 				label: "Coca-Cola 2L",
	// 				id: 1,
	// 				quantity:1
	// 			},
	// 			{
	// 				label: "Pizza Calabresa",
	// 				id: 3,
	// 				quantity:2
	// 			},
	// 			{
	// 				label: "Pizza Frango",
	// 				id: 4,
	// 				quantity:1
	// 			},
	// 		],
	// 		actions: "",
	// 	},
	// 	{
	// 		id: 5,
	// 		nomeDoCliente: "Ronaldinho Gaucho",
	// 		status: "Criado",
	// 		endereco: "Rua dos bobos, 0",
	// 		telefone: "19963521478",
	// 		hora: "12:00",
	// 		pago: true,
	// 		valorTotal: 80,
	// 		metodoPagamento: "cartão",
	// 		observacoes: "",
	// 		entrega: true,
	// 		items: [
	// 			{
	// 				label: "Coca-Cola 2L",
	// 				id: 1,
	// 				quantity:1
	// 			},
	// 			{
	// 				label: "Pizza Calabresa",
	// 				id: 3,
	// 				quantity:2
	// 			},
	// 			{
	// 				label: "Pizza Frango",
	// 				id: 4,
	// 				quantity:1
	// 			},
	// 		],
	// 		actions: "",
	// 	},
	// 	{
	// 		id: 6,
	// 		nomeDoCliente: "Geraldino",
	// 		status: "Criado",
	// 		endereco: "Rua dos bobos, 0",
	// 		telefone: "19963521478",
	// 		hora: "12:00",
	// 		pago: true,
	// 		valorTotal: 80,
	// 		metodoPagamento: "cartão",
	// 		observacoes: "",
	// 		entrega: true,
	// 		items: [
	// 			{
	// 				label: "Coca-Cola 2L",
	// 				id: 1,
	// 				quantity:1
	// 			},
	// 			{
	// 				label: "Pizza Calabresa",
	// 				id: 3,
	// 				quantity:2
	// 			},
	// 			{
	// 				label: "Pizza Frango",
	// 				id: 4,
	// 				quantity:1
	// 			},
	// 		],
	// 		actions: "",
	// 	},
	// 	{
	// 		id: 7,
	// 		nomeDoCliente: "Silviscleiton",
	// 		status: "Criado",
	// 		endereco: "Rua dos bobos, 0",
	// 		telefone: "19963521485",
	// 		hora: "12:00",
	// 		pago: true,
	// 		valorTotal: 80,
	// 		metodoPagamento: "cartão",
	// 		observacoes: "",
	// 		entrega: true,
	// 		items: [
	// 			{
	// 				label: "Coca-Cola 2L",
	// 				id: 1,
	// 				quantity:1
	// 			},
	// 			{
	// 				label: "Pizza Calabresa",
	// 				id: 3,
	// 				quantity:2
	// 			},
	// 			{
	// 				label: "Pizza Frango",
	// 				id: 4,
	// 				quantity:1
	// 			},
	// 		],
	// 		actions: "",
	// 	},
	// 	{
	// 		id: 8,
	// 		nomeDoCliente: "Geraldo da Silva",
	// 		status: "Criado",
	// 		endereco: "Rua dos bobos, 0",
	// 		telefone: "19963521478",
	// 		hora: "12:00",
	// 		pago: true,
	// 		valorTotal: 80,
	// 		metodoPagamento: "cartão",
	// 		observacoes: "",
	// 		entrega: true,
	// 		items: [
	// 			{
	// 				label: "Coca-Cola 2L",
	// 				id: 1,
	// 				quantity:1
	// 			},
	// 			{
	// 				label: "Pizza Calabresa",
	// 				id: 3,
	// 				quantity:2
	// 			},
	// 			{
	// 				label: "Pizza Frango",
	// 				id: 4,
	// 				quantity:1
	// 			},
	// 		],
	// 		actions: "",
	// 	},
	// ]);

	
	const statusByNumber = (number) => {
		switch(number) {
			case 1:
			  return "Criado";
			case 2:
			  return "Em Preparo";
			case 3:
				return "Pronto P/ Entrega";
			case 4:
				return "Saiu P/ Entrega";
			case 5:
				return "Entregue";
			default:
				return "---";
		  }
	};
	
	const pagamentoByNumber = (number) => {
		switch(number) {
			case 1:
			  return "Dinheiro";
			case 2:
			  return "Cartão";
			case 3:
				return "Pix";
			default:
				return "---";
		  }
	};

    const model = require('../entities/model')
	const [open, setOpen] = React.useState(false);
	
    const [pedido, setPedido] = React.useState(new model)

	const [name, setName] = React.useState("");
	const [telefone, setTelefone] = React.useState("");
	const [endereco, setEndereco] = React.useState("");
	const [observacoes,setObservacoes] = React.useState("");

	const [status, setStatus] = React.useState("");
	const handleStatusChange = (e) => {
		setStatus(e.target.value);
	};

	const [metodoPagamento, setMetodoPagamento] = React.useState("");
	const handleMetodoPagamentoChange = (e) => {
		setMetodoPagamento(e.target.value);
	};

	const [pagamentoStatus, setPagamentoStatus] = React.useState(false);
	const handlePagamentoStatusChange = (e) => {
		setPagamentoStatus(e.target.value);
	};

	const [itemValue, setItemValue] = React.useState(null)
	const handleItemValueChange = (event,value) =>
	{
		setItemValue(value);
	};

	const [itemQuantity, setItemQuantity] = React.useState(1)
	const handleItemQuantityChange = (event) =>
	{
		if(event.target.value > 0)
			setItemQuantity(event.target.value)
		
		
	};

	const handleAddItem = (e) => {
		console.log(itemValue);
		if(!itemValue) return;

		var existingItemIndex = itemsArray.findIndex(item => item.id == itemValue.id);

		if(existingItemIndex > -1){
			const newState = itemsArray.map( obj => {
				if(obj.id == itemValue.id){
					obj.quantity += Number(itemQuantity);
					return obj;
				}
				return obj;
			});
			setItemsArray(newState);
		}else{
			const newState = itemsArray.concat(
				{
					nome: itemValue.nome,
					id: itemValue.id,
					valor: itemValue.valor,
					ingredientes: itemValue.ingredientes,
					descricao: itemValue.descricao,
					quantity: itemQuantity
				}
			);
			setItemsArray(newState);
		}
		setItemQuantity(1);
		setItemValue(null);
	};

	const loadProdutos = async () => {
		fetch("/app/produto?format=json")
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			setProdutos(data);
			
		});
	};

	const handleClickOpen = (i) => {
		loadProdutos();
        if(i){
			setName(i.nomeDoCliente);
			setTelefone(i.telefone);
			//setHora(i.hora);
			setEndereco(i.endereco);
			setStatus(i.status);
			setMetodoPagamento(i.metodoPagamento);
			setPagamentoStatus(i.pago);
			setItemsArray(i.items);
			setObservacoes(i.observacoes)
			setPedido(new model(
				i.id,
				i.nomeDoCliente,
				i.telefone,
				i.hora,
				i.endereco,
				i.items, 
				i.observacoes,
				i.pago,
				i.metodoPagamento,
				i.status
				));
			console.log(pedido);
		}else{
			clean();
		}
		
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const clean = () => {
		setName("");
		setTelefone("");
		//setHora(new Date().toLocaleTimeString());
		setEndereco("");
		setMetodoPagamento("dinheiro");
		setStatus(1);
		setObservacoes("");
		setItemsArray([]);
		setPagamentoStatus(false);
		setPedido(new model);

	}

	const handleSave = () => {
		
		console.log(name)

		//First validate if empty fields
		var emptyFields = "";
		if(!name)
			emptyFields+= "Nome, "

		console.log(emptyFields);
		//If some field is Empty, show message

		//Second, if editing, validate that was changes
		if(pedido && pedido.id){
			var changes = "";
			if(pedido.name != name)
				changes+= "Nome, ";

			console.log(`Changes: ${changes}`)
			const newState = pedidos.map( obj => {
				if(obj.id == pedido.id){
					obj.nomeDoCliente = name;
					obj.telefone = telefone;
					//obj.hora = hora; Não atualiza hora
					obj.endereco = endereco;
					obj.items = itemsArray;
					obj.observacoes = observacoes;
					obj.pago = pagamentoStatus;
					obj.metodoPagamento = metodoPagamento;
					obj.status = status;

					return obj;
				}
				return obj;
			});
			console.log("edit");
			setPedidos(newState);
			setFilteredList(newState);
			setOpen(false);
		}
		else
		{
			const hora = new Date().toISOString();
			const newState = pedidos.concat({
				id: pedidos[pedidos.length - 1].id + 1,
				nomeDoCliente: name,
				status: status,
				endereco: endereco,
				telefone: telefone,
				hora: hora,
				pago: pagamentoStatus,
				valorTotal: 80,
				metodoPagamento: pagamentoStatus,
				observacoes: observacoes,
				entrega: true,
				items: itemsArray
			});
			setPedidos(newState);
			setFilteredList(newState);
			setOpen(false);
		}
		
		


	};

	const [filteredList, setFilteredList] = React.useState(pedidos);

	const onSearchChanged = (e) => {
		setFilteredList(
			e.target.value
				? pedidos.filter(function (pedido) {
						return (
							pedido.id == Number(e.target.value) ||
							pedido.telefone.includes(e.target.value) ||
							pedido.nomeDoCliente.includes(e.target.value)
						);
				  })
				: pedidos
		);
	};

	const [produtos, setProdutos] = React.useState([]);

	const [itemsArray, setItemsArray] = useState([]);

	const removeItem = (event, value) => {
		setItemsArray(itemsArray.filter((e) => e !== value));
	};

	return (
    <Box sx={{ display: "flex" }}>
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                onChange={onSearchChanged}
                placeholder="Busque o pedido"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={(e) => handleClickOpen(null)}
            >
              Novo Pedido
            </Button>
            <Dialog
              fullWidth={true}
              maxWidth="xl"
              open={open}
              onClose={handleClose}
            >
              <DialogTitle>{pedido.id ? `Editando pedido ${pedido.id}` : "Novo Pedido"}</DialogTitle>
              <DialogContent>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  <div>
                    <TextField
                      label="Nome do Cliente"
					  id="name"
                      sx={{ m: 1, width: "25ch" }}
                      value={name || ""}
					  onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                      label="Telefone"
                      id="telefone"
                      sx={{ m: 1, width: "25ch" }}
                      value={telefone || ""}
					  onChange={(e) => setTelefone(e.target.value)}
                    />
                    {/* <TextField
                      label="Horário do Pedido"
                      id="horario"
                      sx={{ m: 1, width: "25ch" }}
                      value={hora || ""}
					  onChange={(e) => setHora(e.target.value)}
                    /> */}

                    <FormControl fullWidth sx={{ m: 1 }}>
                      <InputLabel htmlFor="endereco">
                        Endereço
                      </InputLabel>
                      <OutlinedInput
                        id="endereco"
                        value={endereco || ""}
					  	onChange={(e) => setEndereco(e.target.value)}
                        label="Endereço"
                      />
						{/* change to textField because Input with bug */}
					  
                    </FormControl>

                    <Grid container justifyContent="flex-start" alignItems="center" spacing={1}>
                      <Grid item>
                        <Autocomplete
                          clearOnEscape
                          id="items-combo-box"
                          options={produtos}
						  getOptionLabel={(option) => `${option.nome} - R$ ${option.valor}`}
                          sx={{ m: 1, width: "25ch" }}
                          value={itemValue} //change this to load only when dialog appears
						  onChange={handleItemValueChange}
                          renderInput={(params) => (
                            <TextField {...params} label="Item" />
                          )}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
							value={itemQuantity}
							onChange={handleItemQuantityChange}
							type="number"
							name="quantity"
							label="Quantidade"
							variant="outlined"
							sx={{ m: 1, width: "25ch" }}
                        />
                      </Grid>
                      <Grid item>
                        <Button
							 sx={{ m: 1, width: "25ch" }}
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleAddItem}
                        >
                          Adicionar Item
                        </Button>
                      </Grid>
                    </Grid>
					<List sx={{ m: 1 }} 
					aria-labelledby="items-list-subheader"
					subheader={
					  <ListSubheader component="div" id="items-list-subheader">
						Items do Pedido
					  </ListSubheader>
					}
					>
						{itemsArray.map((value) => {
							const labelId = `checkbox-list-label-${value.id}`;
							return (
								<div key={value.id}>
									<ListItem
									key={value.id}
									sx={{
										maxWidth: "200px",
									}}
									>
										<ListItemText
											id={labelId}
											primary={`${value.quantity} x ${value.nome} - ${value.valor}`}
										/>
										<DeleteIcon
											sx={{
												cursor: "pointer",
											}}
											onClick={(event) =>
												removeItem(
													event,
													value
												)}
										/>
									</ListItem>
									<Divider sx={{ m: 1 }} />
								</div>
							);
						})}
					</List>
					<FormControl sx={{ m: 1, width: "25ch" }}>
						<InputLabel id="metodo-pagamento-label">Método Pagamento</InputLabel>
						<Select
							labelId="metodo-pagamento-label"
							id="metodo-pagamento-select"
							label="Método Pagamento"
							value={metodoPagamento}
							onChange={handleMetodoPagamentoChange}
						>
							<MenuItem value="dinheiro">Dinheiro</MenuItem>
							<MenuItem value="cartão">Cartão</MenuItem>
							<MenuItem value="pix">Pix</MenuItem>
						</Select>
					</FormControl>
					<FormControl sx={{ m: 1, width: "25ch" }}>
						<InputLabel id="status-select-label">Status</InputLabel>
						<Select
							labelId="status-select-label"
							id="status-select"
							label="Status"
							value={status}
							onChange={handleStatusChange}
						>
							<MenuItem value={1}>Criado</MenuItem>
							<MenuItem value={2}>Preparando</MenuItem>
							<MenuItem value={3}>Feito</MenuItem>
							<MenuItem value={4}>Saiu P/ Entrega</MenuItem>
							<MenuItem value={5}>Entregue</MenuItem>
						</Select>
					</FormControl>
					<FormControl sx={{ m: 1, width: "25ch" }}>
						<InputLabel id="pago-status-label">Pagamento Status</InputLabel>
						<Select
							labelId="pago-status-label"
							id="pago-status-select"
							label="Pagamento Status"
							value={pagamentoStatus}
							onChange={handlePagamentoStatusChange} 
						>
							{/* */}
							<MenuItem value={true}>Pagamento Efetuado</MenuItem>
							<MenuItem value={false}>Pagamento Pendente</MenuItem>
						</Select>
					</FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
                      <InputLabel htmlFor="outlined-adornment-amount">
                        Observações
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-amount"
                        value={observacoes || ""}
					  	onChange={(e) => setObservacoes(e.target.value)}
                        label="Observações"
                      />
                    </FormControl>
                  </div>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleSave}>Salvar</Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
        <br />

        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={filteredList}
			loading={pedidosLoading}
            columns={columns}
            pageSize={5}
			density="comfortable"
            localeText={{
              columnMenuLabel: "Menu",
              columnMenuShowColumns: "Visualização de Colunas",
              columnMenuFilter: "Filtrar",
              columnMenuHideColumn: "Esconder",
              columnMenuUnsort: "Desfazer Ordenação",
              columnMenuSortAsc: "Ordenar Asc",
              columnMenuSortDesc: "Ordenar Desc",
              columnHeaderSortIconLabel: "Ordenar",
              toolbarFiltersTooltipActive: (count) =>
                count !== 1 ? `${count} filtros` : `${count} filtro`,
              filterPanelAddFilter: "Adicionar Filtro",
              filterPanelDeleteIconLabel: "Excluir",
              filterPanelLinkOperator: "Operador Lógico",
              filterPanelOperators: "Operador do Filtro", // TODO v6: rename to filterPanelOperator
              filterPanelOperatorAnd: "E",
              filterPanelOperatorOr: "OU",
              filterPanelColumns: "Colunas",
              filterPanelInputLabel: "Valor",
              filterPanelInputPlaceholder: "Filtrar valor",

              // Filter operators text
              filterOperatorContains: "contém",
              filterOperatorEquals: "é exatamente",
              filterOperatorStartsWith: "começa com",
              filterOperatorEndsWith: "termina com",
              filterOperatorIs: "é",
              filterOperatorNot: "não é",
              filterOperatorAfter: "está depois de",
              filterOperatorOnOrAfter: "está em ou depois",
              filterOperatorBefore: "está antes",
              filterOperatorOnOrBefore: "está em ou antes",
              filterOperatorIsEmpty: "está vazio",
              filterOperatorIsNotEmpty: "não está vazio",
              filterOperatorIsAnyOf: "é um dos",

              // Columns panel text
              columnsPanelTextFieldLabel: "Encontrar coluna",
              columnsPanelTextFieldPlaceholder: "Título da Coluna",
              columnsPanelDragIconLabel: "Reordenar coluna",
              columnsPanelShowAllButton: "Mostrar todos",
              columnsPanelHideAllButton: "Esconder todos",
              footerRowSelected: (count) =>
                count !== 1
                  ? `${count.toLocaleString()} linhas selecionadas`
                  : `${count.toLocaleString()} linha selecionada`,
            }}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  // Columns to be hide
                  endereco: false,
                },
              },
            }}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      </Box>
    </Box>
  );
}
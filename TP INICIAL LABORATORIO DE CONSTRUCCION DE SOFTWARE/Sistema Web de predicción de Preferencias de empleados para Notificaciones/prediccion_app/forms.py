from django import forms

class EmpleadoForm(forms.Form):
    DEPARTAMENTO_CHOICES = [
        ("Elegir un departamento", "Elegir un departamento"),
        ("Recursos Humanos", "Recursos Humanos"),
        ("IT", "Tecnología de la Información"),
        ("Finanzas", "Finanzas"),
        ("Marketing", "Marketing"),
        ("Ventas", "Ventas"),
        ("Logistica", "Logística"),
        ("Atención al cliente", "Atención al cliente"),
    ]

    nombre = forms.CharField(
        label="Nombre",
        required=True,
        widget=forms.TextInput(attrs={
            'id': 'nombre',
            'placeholder': 'Ingrese el nombre.',
            'class': 'input'
        })
    )
    apellido = forms.CharField(
        label="Apellido",
        required=True,
        widget=forms.TextInput(attrs={
            'id': 'apellido',
            'placeholder': 'Ingrese el apellido.',
            'class': 'input'
        })
    )
    edad = forms.IntegerField(
        label="Edad",
        required=True,
        widget=forms.NumberInput(attrs={
            'id': 'edad',
            'placeholder': 'Ingrese la edad.',
            'class': 'input'
        })
    )
    antiguedad = forms.IntegerField(
        label="Antigüedad",
        required=True,
        widget=forms.NumberInput(attrs={
            'id': 'antiguedad',
            'placeholder': 'Ingrese la antigüedad.',
            'class': 'input'
        })
    )
    departamento = forms.ChoiceField(
        label="Departamento",
        choices=DEPARTAMENTO_CHOICES,
        required=True,
        widget=forms.Select(attrs={
            'id': 'departamento',
            'class': 'input'
        })
    )
class EmpleadosForm(forms.Form):
    empleados = forms.FileField(label='Sube los datos de tus empleados en un archivo Excel con terminación .xlsx. La tabla debe estar dividida por columnas donde se contengan los datos: Nombre - Apellido - Edad - Antiguedad - Departamento.',
                                widget=forms.ClearableFileInput(attrs={
                                    'id': 'empleados',
                                    'class': 'input'
                                }))

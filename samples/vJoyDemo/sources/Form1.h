#pragma once


namespace vJoyDemo {

	using namespace System;
	using namespace System::ComponentModel;
	using namespace System::Collections;
	using namespace System::Windows::Forms;
	using namespace System::Data;
	using namespace System::Drawing;

	/// <summary>
	/// Summary for Form1
	///
	/// WARNING: If you change the name of this class, you will need to change the
	///          'Resource File Name' property for the managed resource compiler tool
	///          associated with all .resx files this class depends on.  Otherwise,
	///          the designers will not be able to interact properly with localized
	///          resources associated with this form.
	/// </summary>
	public ref class Form1 : public System::Windows::Forms::Form
	{
	public:
		Form1(void)
		{
			// Form init
			InitializeComponent();
			if (InitializeDevice())	// Init and test vJoy device
				js_update();
			return;
		}

	protected:
		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		~Form1()
		{
			if (components)
			{
				delete components;
			}
		}
	private: System::Windows::Forms::TextBox^  textBox1;
	private: System::Windows::Forms::TextBox^  textBoxX;

	private: System::Windows::Forms::GroupBox^  groupBox1;
	private: System::Windows::Forms::TrackBar^  trackBarX;
	private: System::Windows::Forms::GroupBox^  groupBox2;
	private: System::Windows::Forms::TrackBar^  trackBar1;
	private: System::Windows::Forms::TextBox^  textBox2;
	private: System::Windows::Forms::GroupBox^  groupBox3;
	private: System::Windows::Forms::GroupBox^  groupBox4;
	private: System::Windows::Forms::TrackBar^  trackBar2;
	private: System::Windows::Forms::TextBox^  textBox3;
	private: System::Windows::Forms::TrackBar^  trackBarY;
	private: System::Windows::Forms::TextBox^  textBoxY;
	private: System::Windows::Forms::CheckBox^  checkBox1;
	private: System::Windows::Forms::CheckBox^  checkBox2;
	private: System::Windows::Forms::CheckBox^  checkBox4;

	private: System::Windows::Forms::CheckBox^  checkBox3;
	private: System::Windows::Forms::CheckBox^  checkBox8;
	private: System::Windows::Forms::CheckBox^  checkBox7;
	private: System::Windows::Forms::CheckBox^  checkBox6;
	private: System::Windows::Forms::CheckBox^  checkBox5;




	protected: 

	private:
		/// <summary>
		/// Required designer variable.
		/// </summary>
		System::ComponentModel::Container ^components;

#pragma region Manually generated code


		BOOL InitializeDevice(void)
		{
			TCHAR Msg[MSG_SIZE];
			System::String ^ str;


			bool isOK = true;
			// Test if vJoy device driver installed
			if (!isInstalled())
			{
				textBox1->Text = L"vJoy Device driver is not installed - Cannot continue\r\n";
				isOK = false;
			};

			// Open
			if (!openDevice())
			{
				textBox1->Text = L"vJoy Device driver cannot be opened - Cannot continue\r\n";
				isOK = false;
			};

			if (!isOK)
			{
				textBox1->Select(1000,0);
				textBoxX->Enabled = false;
				trackBarX->Enabled = false;
				return FALSE;
			};


			// Get vJoy device driver Version
			getDeviceAttrib(Msg);

			// Put data in text box
			str = gcnew System::String(Msg);
			textBox1->Text = str;
			textBox1->Select(1000,0);

			return TRUE;
		}

	private: System::Void js_update(void) {
				 JOYSTICK_POSITION	Report;

				 // Axes
				 Report.wAxisX = (USHORT)this->trackBarX->Value;
				 Report.wAxisY = (USHORT)this->trackBarY->Value;
				 Report.wAxisZ = 0;
				 Report.wAxisXRot = 0;
				 Report.wAxisYRot = 0;
				 Report.wAxisZRot = 0;
				 Report.wAxisVBRX = 0;
				 Report.wAxisVBRY = 0;
				 Report.wAxisVBRZ = 0;
				 Report.wAxisVX = 0;
				 Report.wAxisVY = 0;
				 Report.wAxisVZ = 0;
				 Report.wAileron = 0;
				 Report.wDial = 0;
				 Report.wRudder = 0;
				 Report.wSlider = 0;
				 Report.wThrottle = 0;
				 Report.wWheel = 0;


				 // Buttons
				 if (this->checkBox1->Checked) Report.lButtons |= 0x1; else Report.lButtons &= 0xFE;
				 if (this->checkBox2->Checked) Report.lButtons |= 0x2; else Report.lButtons &= 0xFD;
				 if (this->checkBox3->Checked) Report.lButtons |= 0x4; else Report.lButtons &= 0xFB;
				 if (this->checkBox4->Checked) Report.lButtons |= 0x8; else Report.lButtons &= 0xF7;
				 if (this->checkBox5->Checked) Report.lButtons |= 0x10; else Report.lButtons &= 0xEF;
				 if (this->checkBox6->Checked) Report.lButtons |= 0x20; else Report.lButtons &= 0xDF;
				 if (this->checkBox7->Checked) Report.lButtons |= 0x40; else Report.lButtons &= 0xBF;
				 if (this->checkBox8->Checked) Report.lButtons |= 0x80; else Report.lButtons &= 0x7F;


				 update_device(&Report);
			 }

#pragma endregion

#pragma region Windows Form Designer generated code
		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		void InitializeComponent(void)
		{
			System::ComponentModel::ComponentResourceManager^  resources = (gcnew System::ComponentModel::ComponentResourceManager(Form1::typeid));
			this->textBox1 = (gcnew System::Windows::Forms::TextBox());
			this->textBoxX = (gcnew System::Windows::Forms::TextBox());
			this->groupBox1 = (gcnew System::Windows::Forms::GroupBox());
			this->groupBox2 = (gcnew System::Windows::Forms::GroupBox());
			this->trackBar1 = (gcnew System::Windows::Forms::TrackBar());
			this->textBox2 = (gcnew System::Windows::Forms::TextBox());
			this->trackBarX = (gcnew System::Windows::Forms::TrackBar());
			this->groupBox3 = (gcnew System::Windows::Forms::GroupBox());
			this->groupBox4 = (gcnew System::Windows::Forms::GroupBox());
			this->trackBar2 = (gcnew System::Windows::Forms::TrackBar());
			this->textBox3 = (gcnew System::Windows::Forms::TextBox());
			this->trackBarY = (gcnew System::Windows::Forms::TrackBar());
			this->textBoxY = (gcnew System::Windows::Forms::TextBox());
			this->checkBox1 = (gcnew System::Windows::Forms::CheckBox());
			this->checkBox2 = (gcnew System::Windows::Forms::CheckBox());
			this->checkBox4 = (gcnew System::Windows::Forms::CheckBox());
			this->checkBox3 = (gcnew System::Windows::Forms::CheckBox());
			this->checkBox8 = (gcnew System::Windows::Forms::CheckBox());
			this->checkBox7 = (gcnew System::Windows::Forms::CheckBox());
			this->checkBox6 = (gcnew System::Windows::Forms::CheckBox());
			this->checkBox5 = (gcnew System::Windows::Forms::CheckBox());
			this->groupBox1->SuspendLayout();
			this->groupBox2->SuspendLayout();
			(cli::safe_cast<System::ComponentModel::ISupportInitialize^  >(this->trackBar1))->BeginInit();
			(cli::safe_cast<System::ComponentModel::ISupportInitialize^  >(this->trackBarX))->BeginInit();
			this->groupBox3->SuspendLayout();
			this->groupBox4->SuspendLayout();
			(cli::safe_cast<System::ComponentModel::ISupportInitialize^  >(this->trackBar2))->BeginInit();
			(cli::safe_cast<System::ComponentModel::ISupportInitialize^  >(this->trackBarY))->BeginInit();
			this->SuspendLayout();
			// 
			// textBox1
			// 
			this->textBox1->BackColor = System::Drawing::SystemColors::Info;
			this->textBox1->Cursor = System::Windows::Forms::Cursors::No;
			this->textBox1->Location = System::Drawing::Point(13, 13);
			this->textBox1->Multiline = true;
			this->textBox1->Name = L"textBox1";
			this->textBox1->ReadOnly = true;
			this->textBox1->Size = System::Drawing::Size(364, 74);
			this->textBox1->TabIndex = 0;
			// 
			// textBoxX
			// 
			this->textBoxX->Location = System::Drawing::Point(6, 19);
			this->textBoxX->Name = L"textBoxX";
			this->textBoxX->Size = System::Drawing::Size(43, 20);
			this->textBoxX->TabIndex = 1;
			this->textBoxX->Text = L"25000";
			this->textBoxX->TextChanged += gcnew System::EventHandler(this, &Form1::textBoxX_TextChanged);
			// 
			// groupBox1
			// 
			this->groupBox1->Controls->Add(this->groupBox2);
			this->groupBox1->Controls->Add(this->trackBarX);
			this->groupBox1->Controls->Add(this->textBoxX);
			this->groupBox1->Location = System::Drawing::Point(13, 103);
			this->groupBox1->Name = L"groupBox1";
			this->groupBox1->Size = System::Drawing::Size(363, 64);
			this->groupBox1->TabIndex = 2;
			this->groupBox1->TabStop = false;
			this->groupBox1->Text = L"Axis X";
			this->groupBox1->Enter += gcnew System::EventHandler(this, &Form1::groupBox1_Enter);
			// 
			// groupBox2
			// 
			this->groupBox2->Controls->Add(this->trackBar1);
			this->groupBox2->Controls->Add(this->textBox2);
			this->groupBox2->Location = System::Drawing::Point(3, 77);
			this->groupBox2->Name = L"groupBox2";
			this->groupBox2->Size = System::Drawing::Size(363, 64);
			this->groupBox2->TabIndex = 3;
			this->groupBox2->TabStop = false;
			this->groupBox2->Text = L"Axis X";
			// 
			// trackBar1
			// 
			this->trackBar1->LargeChange = 500;
			this->trackBar1->Location = System::Drawing::Point(71, 17);
			this->trackBar1->Maximum = 50000;
			this->trackBar1->Name = L"trackBar1";
			this->trackBar1->Size = System::Drawing::Size(291, 45);
			this->trackBar1->SmallChange = 100;
			this->trackBar1->TabIndex = 2;
			this->trackBar1->TickFrequency = 1000;
			this->trackBar1->TickStyle = System::Windows::Forms::TickStyle::None;
			this->trackBar1->Value = 25000;
			// 
			// textBox2
			// 
			this->textBox2->Location = System::Drawing::Point(6, 19);
			this->textBox2->Name = L"textBox2";
			this->textBox2->Size = System::Drawing::Size(43, 20);
			this->textBox2->TabIndex = 1;
			this->textBox2->Text = L"25000";
			// 
			// trackBarX
			// 
			this->trackBarX->LargeChange = 500;
			this->trackBarX->Location = System::Drawing::Point(71, 17);
			this->trackBarX->Maximum = 50000;
			this->trackBarX->Name = L"trackBarX";
			this->trackBarX->Size = System::Drawing::Size(291, 45);
			this->trackBarX->SmallChange = 100;
			this->trackBarX->TabIndex = 2;
			this->trackBarX->TickFrequency = 1000;
			this->trackBarX->Value = 25000;
			this->trackBarX->Scroll += gcnew System::EventHandler(this, &Form1::trackBarX_Scroll);
			// 
			// groupBox3
			// 
			this->groupBox3->Controls->Add(this->groupBox4);
			this->groupBox3->Controls->Add(this->trackBarY);
			this->groupBox3->Controls->Add(this->textBoxY);
			this->groupBox3->Location = System::Drawing::Point(14, 173);
			this->groupBox3->Name = L"groupBox3";
			this->groupBox3->Size = System::Drawing::Size(363, 64);
			this->groupBox3->TabIndex = 2;
			this->groupBox3->TabStop = false;
			this->groupBox3->Text = L"Axis Y";
			this->groupBox3->Enter += gcnew System::EventHandler(this, &Form1::groupBox1_Enter);
			// 
			// groupBox4
			// 
			this->groupBox4->Controls->Add(this->trackBar2);
			this->groupBox4->Controls->Add(this->textBox3);
			this->groupBox4->Location = System::Drawing::Point(3, 77);
			this->groupBox4->Name = L"groupBox4";
			this->groupBox4->Size = System::Drawing::Size(363, 64);
			this->groupBox4->TabIndex = 3;
			this->groupBox4->TabStop = false;
			this->groupBox4->Text = L"Axis X";
			// 
			// trackBar2
			// 
			this->trackBar2->LargeChange = 500;
			this->trackBar2->Location = System::Drawing::Point(71, 17);
			this->trackBar2->Maximum = 50000;
			this->trackBar2->Name = L"trackBar2";
			this->trackBar2->Size = System::Drawing::Size(291, 45);
			this->trackBar2->SmallChange = 100;
			this->trackBar2->TabIndex = 2;
			this->trackBar2->TickFrequency = 1000;
			this->trackBar2->TickStyle = System::Windows::Forms::TickStyle::None;
			this->trackBar2->Value = 25000;
			// 
			// textBox3
			// 
			this->textBox3->Location = System::Drawing::Point(6, 19);
			this->textBox3->Name = L"textBox3";
			this->textBox3->Size = System::Drawing::Size(43, 20);
			this->textBox3->TabIndex = 1;
			this->textBox3->Text = L"25000";
			// 
			// trackBarY
			// 
			this->trackBarY->LargeChange = 500;
			this->trackBarY->Location = System::Drawing::Point(71, 17);
			this->trackBarY->Maximum = 50000;
			this->trackBarY->Name = L"trackBarY";
			this->trackBarY->Size = System::Drawing::Size(291, 45);
			this->trackBarY->SmallChange = 100;
			this->trackBarY->TabIndex = 2;
			this->trackBarY->TickFrequency = 1000;
			this->trackBarY->Value = 25000;
			this->trackBarY->Scroll += gcnew System::EventHandler(this, &Form1::trackBarY_Scroll);
			// 
			// textBoxY
			// 
			this->textBoxY->Location = System::Drawing::Point(6, 19);
			this->textBoxY->Name = L"textBoxY";
			this->textBoxY->Size = System::Drawing::Size(43, 20);
			this->textBoxY->TabIndex = 1;
			this->textBoxY->Text = L"25000";
			this->textBoxY->TextChanged += gcnew System::EventHandler(this, &Form1::textBoxY_TextChanged);
			// 
			// checkBox1
			// 
			this->checkBox1->Appearance = System::Windows::Forms::Appearance::Button;
			this->checkBox1->AutoSize = true;
			this->checkBox1->Location = System::Drawing::Point(14, 359);
			this->checkBox1->Name = L"checkBox1";
			this->checkBox1->Size = System::Drawing::Size(23, 23);
			this->checkBox1->TabIndex = 3;
			this->checkBox1->Text = L"1";
			this->checkBox1->UseVisualStyleBackColor = true;
			this->checkBox1->CheckedChanged += gcnew System::EventHandler(this, &Form1::checkBox1_CheckedChanged);
			// 
			// checkBox2
			// 
			this->checkBox2->Appearance = System::Windows::Forms::Appearance::Button;
			this->checkBox2->AutoSize = true;
			this->checkBox2->Location = System::Drawing::Point(62, 359);
			this->checkBox2->Name = L"checkBox2";
			this->checkBox2->Size = System::Drawing::Size(23, 23);
			this->checkBox2->TabIndex = 4;
			this->checkBox2->Text = L"2";
			this->checkBox2->UseVisualStyleBackColor = true;
			this->checkBox2->CheckedChanged += gcnew System::EventHandler(this, &Form1::checkBox2_CheckedChanged);
			// 
			// checkBox4
			// 
			this->checkBox4->Appearance = System::Windows::Forms::Appearance::Button;
			this->checkBox4->AutoSize = true;
			this->checkBox4->Location = System::Drawing::Point(158, 359);
			this->checkBox4->Name = L"checkBox4";
			this->checkBox4->Size = System::Drawing::Size(23, 23);
			this->checkBox4->TabIndex = 6;
			this->checkBox4->Text = L"4";
			this->checkBox4->UseVisualStyleBackColor = true;
			this->checkBox4->CheckedChanged += gcnew System::EventHandler(this, &Form1::checkBox4_CheckedChanged);
			// 
			// checkBox3
			// 
			this->checkBox3->Appearance = System::Windows::Forms::Appearance::Button;
			this->checkBox3->AutoSize = true;
			this->checkBox3->Location = System::Drawing::Point(110, 359);
			this->checkBox3->Name = L"checkBox3";
			this->checkBox3->Size = System::Drawing::Size(23, 23);
			this->checkBox3->TabIndex = 5;
			this->checkBox3->Text = L"3";
			this->checkBox3->UseVisualStyleBackColor = true;
			this->checkBox3->CheckedChanged += gcnew System::EventHandler(this, &Form1::checkBox3_CheckedChanged);
			// 
			// checkBox8
			// 
			this->checkBox8->Appearance = System::Windows::Forms::Appearance::Button;
			this->checkBox8->AutoSize = true;
			this->checkBox8->Location = System::Drawing::Point(350, 359);
			this->checkBox8->Name = L"checkBox8";
			this->checkBox8->Size = System::Drawing::Size(23, 23);
			this->checkBox8->TabIndex = 10;
			this->checkBox8->Text = L"8";
			this->checkBox8->UseVisualStyleBackColor = true;
			this->checkBox8->CheckedChanged += gcnew System::EventHandler(this, &Form1::checkBox8_CheckedChanged);
			// 
			// checkBox7
			// 
			this->checkBox7->Appearance = System::Windows::Forms::Appearance::Button;
			this->checkBox7->AutoSize = true;
			this->checkBox7->Location = System::Drawing::Point(302, 359);
			this->checkBox7->Name = L"checkBox7";
			this->checkBox7->Size = System::Drawing::Size(23, 23);
			this->checkBox7->TabIndex = 9;
			this->checkBox7->Text = L"7";
			this->checkBox7->UseVisualStyleBackColor = true;
			this->checkBox7->CheckedChanged += gcnew System::EventHandler(this, &Form1::checkBox7_CheckedChanged);
			// 
			// checkBox6
			// 
			this->checkBox6->Appearance = System::Windows::Forms::Appearance::Button;
			this->checkBox6->AutoSize = true;
			this->checkBox6->Location = System::Drawing::Point(254, 359);
			this->checkBox6->Name = L"checkBox6";
			this->checkBox6->Size = System::Drawing::Size(23, 23);
			this->checkBox6->TabIndex = 8;
			this->checkBox6->Text = L"6";
			this->checkBox6->UseVisualStyleBackColor = true;
			this->checkBox6->CheckedChanged += gcnew System::EventHandler(this, &Form1::checkBox6_CheckedChanged);
			// 
			// checkBox5
			// 
			this->checkBox5->Appearance = System::Windows::Forms::Appearance::Button;
			this->checkBox5->AutoSize = true;
			this->checkBox5->Location = System::Drawing::Point(206, 359);
			this->checkBox5->Name = L"checkBox5";
			this->checkBox5->Size = System::Drawing::Size(23, 23);
			this->checkBox5->TabIndex = 7;
			this->checkBox5->Text = L"5";
			this->checkBox5->UseVisualStyleBackColor = true;
			this->checkBox5->CheckedChanged += gcnew System::EventHandler(this, &Form1::checkBox5_CheckedChanged);
			// 
			// Form1
			// 
			this->AutoScaleDimensions = System::Drawing::SizeF(6, 13);
			this->AutoScaleMode = System::Windows::Forms::AutoScaleMode::Font;
			this->BackgroundImageLayout = System::Windows::Forms::ImageLayout::None;
			this->ClientSize = System::Drawing::Size(389, 394);
			this->Controls->Add(this->checkBox8);
			this->Controls->Add(this->checkBox7);
			this->Controls->Add(this->checkBox6);
			this->Controls->Add(this->checkBox5);
			this->Controls->Add(this->checkBox4);
			this->Controls->Add(this->checkBox3);
			this->Controls->Add(this->checkBox2);
			this->Controls->Add(this->checkBox1);
			this->Controls->Add(this->groupBox3);
			this->Controls->Add(this->groupBox1);
			this->Controls->Add(this->textBox1);
			this->Icon = (cli::safe_cast<System::Drawing::Icon^  >(resources->GetObject(L"$this.Icon")));
			this->MaximizeBox = false;
			this->Name = L"Form1";
			this->Text = L"vJoy Demo";
			this->groupBox1->ResumeLayout(false);
			this->groupBox1->PerformLayout();
			this->groupBox2->ResumeLayout(false);
			this->groupBox2->PerformLayout();
			(cli::safe_cast<System::ComponentModel::ISupportInitialize^  >(this->trackBar1))->EndInit();
			(cli::safe_cast<System::ComponentModel::ISupportInitialize^  >(this->trackBarX))->EndInit();
			this->groupBox3->ResumeLayout(false);
			this->groupBox3->PerformLayout();
			this->groupBox4->ResumeLayout(false);
			this->groupBox4->PerformLayout();
			(cli::safe_cast<System::ComponentModel::ISupportInitialize^  >(this->trackBar2))->EndInit();
			(cli::safe_cast<System::ComponentModel::ISupportInitialize^  >(this->trackBarY))->EndInit();
			this->ResumeLayout(false);
			this->PerformLayout();

		}
#pragma endregion


		// Axis text box changed handler
		// Set the value of track-bar acording to the value of the corresponding text box
	private: System::Void textbox_text_changed(System::Windows::Forms::TrackBar^ tb, System::Windows::Forms::TextBox^  txt){

				 int val;

				 try
				 {
					 val = int::Parse(txt->Text);
					 if (val > tb->Maximum) val = tb->Maximum;
					 if (val < tb->Minimum) val = tb->Minimum;
				 }
				 catch (FormatException^)
				 {
					 val = tb->Value;
				 };
				 txt->Text = val.ToString();
				 tb->Value = val;

			 }

			 // Axis track bar scroll handler
			 // Set the value of text box according to the value of the corresponding track bar
	private: System::Void trackBar_Scroll(System::Windows::Forms::TrackBar^ tb, System::Windows::Forms::TextBox^  txt){
				 txt->Text = tb->Value.ToString();
			 }

	private: System::Void groupBox1_Enter(System::Object^  sender, System::EventArgs^  e) {
			 }

			 //// Individual axes and buttons
			 // Axis X
	private: System::Void trackBarX_Scroll(System::Object^  sender, System::EventArgs^  e) {
				 trackBar_Scroll(this->trackBarX, this->textBoxX);
			 }



	private: System::Void textBoxX_TextChanged(System::Object^  sender, System::EventArgs^  e) {
				 textbox_text_changed(this->trackBarX, this->textBoxX);

				 // Inform vJoy axis X
				 js_update();

			 }

			 // Axis Y
	private: System::Void trackBarY_Scroll(System::Object^  sender, System::EventArgs^  e) {
				 trackBar_Scroll(this->trackBarY, this->textBoxY);
			 }

	private: System::Void textBoxY_TextChanged(System::Object^  sender, System::EventArgs^  e) {
				 // Inform vJoy axis Y
				 js_update();
			 }

	// Buttons
	private: System::Void checkBox1_CheckedChanged(System::Object^  sender, System::EventArgs^  e) {
				 js_update();
			 }
	private: System::Void checkBox2_CheckedChanged(System::Object^  sender, System::EventArgs^  e) {
				 js_update();
			 }

	private: System::Void checkBox3_CheckedChanged(System::Object^  sender, System::EventArgs^  e) {
				 js_update();
			 }
	private: System::Void checkBox4_CheckedChanged(System::Object^  sender, System::EventArgs^  e) {
				 js_update();
			 }
	private: System::Void checkBox5_CheckedChanged(System::Object^  sender, System::EventArgs^  e) {
				 js_update();
			 }
	private: System::Void checkBox6_CheckedChanged(System::Object^  sender, System::EventArgs^  e) {
				 js_update();
			 }
	private: System::Void checkBox7_CheckedChanged(System::Object^  sender, System::EventArgs^  e) {
				 js_update();
			 }
	private: System::Void checkBox8_CheckedChanged(System::Object^  sender, System::EventArgs^  e) {
				 js_update();
			 }

			 //-----------------------------------------------------------------------------------
	};
}

